import {
    CallExpression,
    Node,
    StringLiteral,
    ObjectLiteralExpression,
    PropertyAssignment,
} from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import type { ClassTransformerWalker } from "./walker_interface"
import { objectToString } from "./utils/object_to_string"

export class CvaWalker implements ClassTransformerWalker {
    public readonly priority = 10
    public readonly name = "CvaWalker"

    public canWalk(node: Node): boolean {
        if (!Node.isCallExpression(node)) return false
        const expr = node.getExpression()
        return Node.isIdentifier(expr) && expr.getText() === "cva"
    }

    public walk(node: Node, context: TransformerContext): TransformResult {
        if (!Node.isCallExpression(node)) {
            throw new Error("Node is not a CallExpression")
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

        const transformedAst = {
            base: baseObj,
            ...(Object.keys(variantsObj).length > 0
                ? { variants: variantsObj }
                : {}),
        }

        const twCall = `${context.tailwindestIdentifier}.variants(${objectToString(transformedAst, 4)})`
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
        node.replaceWithText(finalReplacement)

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
}
