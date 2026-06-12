import {
    CallExpression,
    Node,
    ObjectLiteralExpression,
    PropertyAssignment,
    SourceFile,
} from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import type { ClassTransformerWalker } from "./walker_interface"
import { quoteClassLiteral } from "./utils/class_literal"
import { objectToString } from "./utils/object_to_string"

type CvaPreservedPlan = {
    base: string[]
    variants: Record<string, Record<string, string[]>>
}

type SplitVariantCallArgsResult = {
    variantArg: string
    extraArgs: string[]
    selectedValues: Record<string, string>
}

export class CvaWalker implements ClassTransformerWalker {
    public readonly priority = 10
    public readonly name = "CvaWalker"
    private readonly preservedPlans = new WeakMap<
        SourceFile,
        Map<string, CvaPreservedPlan>
    >()

    public canWalk(node: Node): boolean {
        if (Node.isIdentifier(node)) {
            return this.isVariantPropsIdentifier(node)
        }

        if (!Node.isCallExpression(node)) return false
        const expr = node.getExpression()
        if (!Node.isIdentifier(expr)) return false

        const name = expr.getText()
        if (name === "cva") return true
        return (
            this.isVariantHelperName(name) &&
            !this.hasLocalCvaDeclaration(node.getSourceFile(), name)
        )
    }

    public walk(node: Node, context: TransformerContext): TransformResult {
        if (Node.isIdentifier(node)) {
            return this.rewriteVariantPropsIdentifier(node, context)
        }

        if (!Node.isCallExpression(node)) {
            throw new Error("Node is not a CallExpression")
        }

        const expression = node.getExpression()
        if (
            Node.isIdentifier(expression) &&
            this.isVariantHelperName(expression.getText())
        ) {
            const original = node.getText()
            const location = {
                line: node.getStartLineNumber(),
                column: node.getStartLinePos(),
            }
            this.rewriteCallSite(node, expression.getText(), true, context)
            return {
                success: true,
                location,
                original,
                transformed: node.wasForgotten() ? "" : node.getText(),
                warnings: [],
            }
        }

        const args = node.getArguments()
        const location = {
            line: node.getStartLineNumber(),
            column: node.getStartLinePos(),
        }

        if (args.length === 0) {
            return {
                success: false,
                location,
                original: node.getText(),
                transformed: node.getText(),
                warnings: ["cva() called with no arguments"],
            }
        }

        const firstArg = args[0]
        let baseObj: Record<string, any> = {}
        const basePreservedTokens: string[] = []
        const warnings: string[] = []

        if (
            Node.isStringLiteral(firstArg) ||
            Node.isNoSubstitutionTemplateLiteral(firstArg)
        ) {
            const baseStr = firstArg.getLiteralText()
            const basePlan = context.analyzer.plan(baseStr)
            basePlan.tokens.forEach((t) => {
                if (t.warning) warnings.push(t.warning)
            })
            baseObj = basePlan.styleTree
            basePreservedTokens.push(
                ...basePlan.preservedTokens.map((token) => token.original)
            )
        }

        const variantsObj: Record<string, any> = {}
        const preservedVariants: Record<string, Record<string, string[]>> = {}
        let defaultVariantsStr = ""
        let compoundVariantsStr = ""

        if (args.length > 1) {
            const secondArg = args[1]
            if (Node.isObjectLiteralExpression(secondArg)) {
                // Parse variants
                const variantsProp = secondArg.getProperty("variants")
                if (variantsProp && Node.isPropertyAssignment(variantsProp)) {
                    const variantsInit = variantsProp.getInitializer()
                    if (Node.isObjectLiteralExpression(variantsInit)) {
                        for (const variantDef of variantsInit.getProperties()) {
                            if (Node.isPropertyAssignment(variantDef)) {
                                const variantName =
                                    this.getPropertyKey(variantDef)
                                const variantOptions =
                                    variantDef.getInitializer()

                                if (
                                    Node.isObjectLiteralExpression(
                                        variantOptions
                                    )
                                ) {
                                    variantsObj[variantName] = {}
                                    for (const option of variantOptions.getProperties()) {
                                        if (Node.isPropertyAssignment(option)) {
                                            const optionName =
                                                this.getPropertyKey(option)
                                            const optionVal =
                                                option.getInitializer()
                                            if (
                                                Node.isStringLiteral(
                                                    optionVal
                                                ) ||
                                                Node.isNoSubstitutionTemplateLiteral(
                                                    optionVal
                                                )
                                            ) {
                                                const optionPlan =
                                                    context.analyzer.plan(
                                                        optionVal.getLiteralText()
                                                    )
                                                optionPlan.tokens.forEach(
                                                    (t) => {
                                                        if (t.warning)
                                                            warnings.push(
                                                                t.warning
                                                            )
                                                    }
                                                )
                                                variantsObj[variantName][
                                                    optionName
                                                ] = optionPlan.styleTree

                                                const preservedTokens =
                                                    optionPlan.preservedTokens.map(
                                                        (token) =>
                                                            token.original
                                                    )
                                                if (
                                                    preservedTokens.length > 0
                                                ) {
                                                    preservedVariants[
                                                        variantName
                                                    ] ??= {}
                                                    preservedVariants[
                                                        variantName
                                                    ][optionName] =
                                                        preservedTokens
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Parse defaultVariants
                const defaultVariantsProp =
                    secondArg.getProperty("defaultVariants")
                if (
                    defaultVariantsProp &&
                    Node.isPropertyAssignment(defaultVariantsProp)
                ) {
                    defaultVariantsStr =
                        defaultVariantsProp.getInitializer()?.getText() ?? ""
                }

                // Parse compoundVariants
                const compoundVariantsProp =
                    secondArg.getProperty("compoundVariants")
                if (
                    compoundVariantsProp &&
                    Node.isPropertyAssignment(compoundVariantsProp)
                ) {
                    compoundVariantsStr =
                        compoundVariantsProp.getInitializer()?.getText() ?? ""
                }
            }
        }

        const variantName = this.getAssignedVariantName(node)
        const hasVariants = Object.keys(variantsObj).length > 0
        const shouldUseVariants =
            hasVariants ||
            (variantName
                ? this.hasVariantExtractorUsage(
                      node.getSourceFile(),
                      variantName
                  )
                : false)

        const transformedAst = {
            base: baseObj,
            ...(hasVariants
                ? { variants: variantsObj }
                : shouldUseVariants
                  ? { variants: {} }
                  : {}),
        }

        const twCall = shouldUseVariants
            ? `${context.tailwindestIdentifier}.variants(${objectToString(transformedAst, 4)})`
            : `${context.tailwindestIdentifier}.style(${objectToString(baseObj, 4)})`
        let finalReplacement = twCall

        // Handle JSDoc preservation
        if (defaultVariantsStr || compoundVariantsStr) {
            let jsDoc = "/**\n"
            if (defaultVariantsStr) {
                // Single line formatting for small objects
                const cleanDefault = defaultVariantsStr.replace(/\\s+/g, " ")
                jsDoc += ` * @defaultVariants ${cleanDefault}\n`
            }
            if (compoundVariantsStr) {
                // If it's an array, try to keep it readable but compact
                jsDoc += ` * @compoundVariants ${compoundVariantsStr.replace(/\n/g, "\n * ")}\n`
            }
            jsDoc += " */\n"

            // To replace the node but prepend JSDoc, we can just replace the node with the JSDoc + new code.
            // However, replacing the node directly via ts-morph replaceWithText works fine.
            finalReplacement = `${jsDoc}${twCall}`
        }

        const original = node.getText()
        const sourceFile = node.getSourceFile()
        if (variantName) {
            this.setPreservedPlan(sourceFile, variantName, {
                base: basePreservedTokens,
                variants: preservedVariants,
            })
        }
        node.replaceWithText(finalReplacement)

        if (variantName) {
            this.rewriteCallSites(
                sourceFile,
                variantName,
                shouldUseVariants,
                context
            )
            if (shouldUseVariants) {
                this.rewriteVariantProps(sourceFile, variantName, context)
            }
        }

        // Context updates
        context.imports.addNamedImport(
            context.tailwindestModulePath,
            context.tailwindestIdentifier
        )
        context.imports.registerToRemove("cva")

        return {
            success: true,
            location,
            original,
            transformed: finalReplacement,
            warnings,
        }
    }

    private getAssignedVariantName(node: CallExpression): string | null {
        const parent = node.getParent()
        if (!Node.isVariableDeclaration(parent)) return null

        const nameNode = parent.getNameNode()
        if (!Node.isIdentifier(nameNode)) return null

        return nameNode.getText()
    }

    private hasLocalCvaDeclaration(
        sourceFile: SourceFile,
        helperName: string
    ): boolean {
        let found = false
        sourceFile.forEachDescendant((candidate) => {
            if (found) return
            if (!Node.isVariableDeclaration(candidate)) return
            const nameNode = candidate.getNameNode()
            if (!Node.isIdentifier(nameNode)) return
            if (nameNode.getText() !== helperName) return

            const initializer = candidate.getInitializer()
            if (!Node.isCallExpression(initializer)) return
            const expression = initializer.getExpression()
            found =
                Node.isIdentifier(expression) && expression.getText() === "cva"
        })
        return found
    }

    private getPropertyKey(property: PropertyAssignment): string {
        const nameNode = property.getNameNode()
        if (
            Node.isStringLiteral(nameNode) ||
            Node.isNoSubstitutionTemplateLiteral(nameNode) ||
            Node.isNumericLiteral(nameNode)
        ) {
            return nameNode.getLiteralText()
        }

        return property.getName()
    }

    private isVariantHelperName(name: string): boolean {
        return /^[A-Za-z_$][\w$]*Variants$/.test(name)
    }

    private isVariantPropsIdentifier(node: Node): boolean {
        if (!Node.isIdentifier(node)) return false
        if (node.getText() !== "VariantProps") return false
        return /VariantProps<\s*typeof\s+[A-Za-z_$][\w$]*Variants\s*>/.test(
            node.getParent().getText()
        )
    }

    private rewriteVariantPropsIdentifier(
        node: Node,
        context: TransformerContext
    ): TransformResult {
        const original = node.getText()
        const location = {
            line: node.getStartLineNumber(),
            column: node.getStartLinePos(),
        }

        node.replaceWithText("GetVariants")
        context.imports.registerToRemove("VariantProps")
        context.imports.addTypeNamedImport("tailwindest", "GetVariants")

        return {
            success: true,
            location,
            original,
            transformed: "GetVariants",
            warnings: [],
        }
    }

    private hasVariantExtractorUsage(
        sourceFile: SourceFile,
        variantName: string
    ): boolean {
        let found = false
        sourceFile.forEachDescendant((candidate) => {
            if (found) return
            if (!Node.isIdentifier(candidate)) return
            const text = candidate.getText()
            if (text !== "VariantProps" && text !== "GetVariants") return
            const parentText = candidate.getParent().getText()
            found = parentText.includes(`typeof ${variantName}`)
        })
        return found
    }

    private rewriteVariantProps(
        sourceFile: SourceFile,
        variantName: string,
        context: TransformerContext
    ): void {
        const variantPropIdentifiers: Node[] = []
        sourceFile.forEachDescendant((candidate) => {
            if (!Node.isIdentifier(candidate)) return
            if (candidate.getText() !== "VariantProps") return
            const parent = candidate.getParent()
            if (!parent.getText().includes(`typeof ${variantName}`)) return
            variantPropIdentifiers.push(candidate)
        })

        if (variantPropIdentifiers.length === 0) return

        for (const identifier of variantPropIdentifiers) {
            if (identifier.wasForgotten()) continue
            identifier.replaceWithText("GetVariants")
        }

        context.imports.registerToRemove("VariantProps")
        context.imports.addTypeNamedImport("tailwindest", "GetVariants")
    }

    private rewriteCallSites(
        sourceFile: SourceFile,
        variantName: string,
        hasVariants: boolean,
        context: TransformerContext
    ): void {
        const calls: CallExpression[] = []
        sourceFile.forEachDescendant((candidate) => {
            if (!Node.isCallExpression(candidate)) return
            const expression = candidate.getExpression()
            if (!Node.isIdentifier(expression)) return
            if (expression.getText() !== variantName) return
            calls.push(candidate)
        })

        for (const call of calls) {
            if (call.wasForgotten()) continue
            this.rewriteCallSite(call, variantName, hasVariants, context)
        }
    }

    private rewriteCallSite(
        call: CallExpression,
        variantName: string,
        hasVariants: boolean,
        context: TransformerContext
    ): void {
        const args = call.getArguments()
        const parent = call.getParent()
        const { variantArg, extraArgs, selectedValues } = hasVariants
            ? this.splitVariantCallArgs(args)
            : this.splitPrimitiveCallArgs(args)
        const preservedPlan = this.getPreservedPlan(
            call.getSourceFile(),
            variantName
        )
        const preservedClassList =
            preservedPlan && this.hasPreservedTokens(preservedPlan)
                ? this.buildPreservedClassList(
                      preservedPlan,
                      selectedValues,
                      call,
                      context
                  )
                : []

        const classReplacement = hasVariants
            ? `${variantName}.class(${variantArg})`
            : `${variantName}.class(${extraArgs.join(", ")})`
        const styleReplacement = hasVariants
            ? `${variantName}.style(${variantArg})`
            : `${variantName}.style()`
        const replacement =
            preservedClassList.length > 0
                ? `${context.tailwindestIdentifier}.def([${preservedClassList.join(", ")}], ${styleReplacement})`
                : classReplacement

        if (
            extraArgs.length > 0 &&
            Node.isCallExpression(parent) &&
            this.isJoinLikeCall(parent, context)
        ) {
            const parentArgs = parent.getArguments()
            const currentArgIndex = parentArgs.findIndex(
                (arg) => arg.getStart() === call.getStart()
            )

            call.replaceWithText(replacement)
            if (currentArgIndex >= 0) {
                parent.insertArguments(currentArgIndex + 1, extraArgs)
            }
            return
        }

        const fallbackReplacement =
            extraArgs.length > 0
                ? `${context.tailwindestIdentifier}.join(${replacement}, ${extraArgs.join(", ")})`
                : replacement
        call.replaceWithText(fallbackReplacement)

        if (extraArgs.length > 0) {
            context.imports.addNamedImport(
                context.tailwindestModulePath,
                context.tailwindestIdentifier
            )
        }
    }

    private splitVariantCallArgs(args: Node[]): SplitVariantCallArgsResult {
        if (args.length === 0) {
            return { variantArg: "{}", extraArgs: [], selectedValues: {} }
        }

        const [firstArg, ...restArgs] = args
        if (!firstArg || !Node.isObjectLiteralExpression(firstArg)) {
            return {
                variantArg: firstArg?.getText() ?? "{}",
                extraArgs: restArgs.map((arg) => arg.getText()),
                selectedValues: {},
            }
        }

        const variantProperties: string[] = []
        const extraArgs: string[] = []
        const selectedValues: Record<string, string> = {}

        for (const property of firstArg.getProperties()) {
            if (
                Node.isPropertyAssignment(property) &&
                this.isClassNameProperty(property)
            ) {
                const initializer = property.getInitializer()
                if (initializer) extraArgs.push(initializer.getText())
                continue
            }

            if (
                Node.isShorthandPropertyAssignment(property) &&
                this.isClassNameKey(property.getName())
            ) {
                extraArgs.push(property.getName())
                continue
            }

            if (Node.isShorthandPropertyAssignment(property)) {
                selectedValues[property.getName()] = property.getName()
            } else if (Node.isPropertyAssignment(property)) {
                const initializer = property.getInitializer()
                if (initializer) {
                    selectedValues[this.getPropertyKey(property)] =
                        initializer.getText()
                }
            }

            variantProperties.push(property.getText())
        }

        extraArgs.push(...restArgs.map((arg) => arg.getText()))

        return {
            variantArg:
                variantProperties.length === 0
                    ? "{}"
                    : `{ ${variantProperties.join(", ")} }`,
            extraArgs,
            selectedValues,
        }
    }

    private splitPrimitiveCallArgs(args: Node[]): SplitVariantCallArgsResult {
        return {
            variantArg: "{}",
            extraArgs: args.map((arg) => arg.getText()),
            selectedValues: {},
        }
    }

    private isClassNameProperty(property: PropertyAssignment): boolean {
        return this.isClassNameKey(this.getPropertyKey(property))
    }

    private isClassNameKey(key: string): boolean {
        return key === "class" || key === "className"
    }

    private setPreservedPlan(
        sourceFile: SourceFile,
        helperName: string,
        plan: CvaPreservedPlan
    ): void {
        let sourcePlans = this.preservedPlans.get(sourceFile)
        if (!sourcePlans) {
            sourcePlans = new Map()
            this.preservedPlans.set(sourceFile, sourcePlans)
        }

        sourcePlans.set(helperName, plan)
    }

    private getPreservedPlan(
        sourceFile: SourceFile,
        helperName: string
    ): CvaPreservedPlan | undefined {
        return this.preservedPlans.get(sourceFile)?.get(helperName)
    }

    private hasPreservedTokens(plan: CvaPreservedPlan): boolean {
        if (plan.base.length > 0) return true

        return Object.values(plan.variants).some((options) =>
            Object.values(options).some((tokens) => tokens.length > 0)
        )
    }

    private buildPreservedClassList(
        plan: CvaPreservedPlan,
        selectedValues: Record<string, string>,
        call: CallExpression,
        context: TransformerContext
    ): string[] {
        const classList = plan.base.map((token) => quoteClassLiteral(token))

        for (const [variantName, options] of Object.entries(plan.variants)) {
            const selectedValue = selectedValues[variantName]

            for (const [optionName, tokens] of Object.entries(options)) {
                if (!selectedValue) {
                    for (const token of tokens) {
                        this.addUnsafePreservedDiagnostic(
                            context,
                            call,
                            token,
                            variantName,
                            optionName
                        )
                    }
                    continue
                }

                const comparisonValue =
                    this.getVariantOptionComparisonValue(optionName)
                const selectedComparisonValue =
                    this.formatSelectedValueForComparison(selectedValue)
                classList.push(
                    ...tokens.map(
                        (token) =>
                            `${selectedComparisonValue} === ${comparisonValue} && ${quoteClassLiteral(token)}`
                    )
                )
            }
        }

        return classList
    }

    private formatSelectedValueForComparison(expression: string): string {
        if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(expression)) {
            return expression
        }

        return `(${expression})`
    }

    private getVariantOptionComparisonValue(optionName: string): string {
        if (optionName === "true" || optionName === "false") {
            return optionName
        }

        return quoteClassLiteral(optionName)
    }

    private addUnsafePreservedDiagnostic(
        context: TransformerContext,
        call: CallExpression,
        token: string,
        variantName: string,
        optionName: string
    ): void {
        context.diagnostics.push({
            level: "warning",
            walkerName: this.name,
            message: `Could not preserve CVA token ${quoteClassLiteral(token)} for ${variantName}.${optionName}; call site does not expose a safe selected value for "${variantName}".`,
            location: {
                line: call.getStartLineNumber(),
                column: call.getStartLinePos(),
            },
        })
    }

    private isJoinLikeCall(
        call: CallExpression,
        context: TransformerContext
    ): boolean {
        const expression = call.getExpression()
        if (Node.isIdentifier(expression)) {
            return ["cn", "clsx", "classNames"].includes(expression.getText())
        }
        if (!Node.isPropertyAccessExpression(expression)) return false
        return (
            expression.getExpression().getText() ===
                context.tailwindestIdentifier && expression.getName() === "join"
        )
    }
}
