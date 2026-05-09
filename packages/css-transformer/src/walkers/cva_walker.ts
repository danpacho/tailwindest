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
import { objectToString } from "./utils/object_to_string"

export class CvaWalker implements ClassTransformerWalker {
    public readonly priority = 10
    public readonly name = "CvaWalker"

    public canWalk(node: Node): boolean {
        if (Node.isIdentifier(node)) {
            return this.isVariantPropsIdentifier(node)
        }

        if (!Node.isCallExpression(node)) return false
        const expr = node.getExpression()
        if (!Node.isIdentifier(expr)) return false

        const name = expr.getText()
        return name === "cva" || this.isVariantHelperName(name)
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
        const warnings: string[] = []

        if (
            Node.isStringLiteral(firstArg) ||
            Node.isNoSubstitutionTemplateLiteral(firstArg)
        ) {
            const baseStr = firstArg.getLiteralText()
            const tokens = context.analyzer.analyze(baseStr)
            tokens.forEach((t) => {
                if (t.warning) warnings.push(t.warning)
            })
            baseObj = context.analyzer.buildObjectTree(tokens)
        }

        const variantsObj: Record<string, any> = {}
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
                                const variantName = variantDef.getName()
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
                                            const optionName = option.getName()
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
                                                const tokens =
                                                    context.analyzer.analyze(
                                                        optionVal.getLiteralText()
                                                    )
                                                tokens.forEach((t) => {
                                                    if (t.warning)
                                                        warnings.push(t.warning)
                                                })
                                                variantsObj[variantName][
                                                    optionName
                                                ] =
                                                    context.analyzer.buildObjectTree(
                                                        tokens
                                                    )
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
        const { variantArg, extraArgs } = hasVariants
            ? this.splitVariantCallArgs(args)
            : this.splitPrimitiveCallArgs(args)
        const replacement = hasVariants
            ? `${variantName}.class(${variantArg})`
            : `${variantName}.class(${extraArgs.join(", ")})`

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

    private splitVariantCallArgs(args: Node[]): {
        variantArg: string
        extraArgs: string[]
    } {
        if (args.length === 0) {
            return { variantArg: "{}", extraArgs: [] }
        }

        const [firstArg, ...restArgs] = args
        if (!firstArg || !Node.isObjectLiteralExpression(firstArg)) {
            return {
                variantArg: firstArg?.getText() ?? "{}",
                extraArgs: restArgs.map((arg) => arg.getText()),
            }
        }

        const variantProperties: string[] = []
        const extraArgs: string[] = []

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

            variantProperties.push(property.getText())
        }

        extraArgs.push(...restArgs.map((arg) => arg.getText()))

        return {
            variantArg:
                variantProperties.length === 0
                    ? "{}"
                    : `{ ${variantProperties.join(", ")} }`,
            extraArgs,
        }
    }

    private splitPrimitiveCallArgs(args: Node[]): {
        variantArg: string
        extraArgs: string[]
    } {
        return {
            variantArg: "{}",
            extraArgs: args.map((arg) => arg.getText()),
        }
    }

    private isClassNameProperty(property: PropertyAssignment): boolean {
        return this.isClassNameKey(property.getName())
    }

    private isClassNameKey(key: string): boolean {
        return key === "class" || key === "className"
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
