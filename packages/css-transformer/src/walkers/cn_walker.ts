import { Node } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import { ClassTransformerWalker } from "./walker_interface"
import { objectToString } from "./utils/object_to_string"
import { getEnclosingComponentName, getTagName } from "./utils/naming"

export interface CnWalkerConfig {
    /**
     * Minimum number of resolved CSS properties required to generate a style object.
     * If the number of properties is below this threshold, raw strings will be used via `tw.join`.
     * @default 0
     */
    objectThreshold?: number
}

export class CnWalker implements ClassTransformerWalker {
    public readonly priority = 20
    public readonly name = "CnWalker"

    constructor(private readonly config: CnWalkerConfig = {}) {}

    public canWalk(node: Node): boolean {
        if (!Node.isCallExpression(node)) return false
        const expr = node.getExpression()
        if (!Node.isIdentifier(expr)) return false

        const name = expr.getText()
        return name === "cn" || name === "clsx" || name === "classNames"
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
                warnings: [
                    `${node.getExpression().getText()} called with no arguments`,
                ],
            }
        }

        const staticClassNames: string[] = []
        const dynamicArgs: string[] = []

        for (const arg of args) {
            if (
                Node.isStringLiteral(arg) ||
                Node.isNoSubstitutionTemplateLiteral(arg)
            ) {
                staticClassNames.push(arg.getLiteralText())
            } else {
                dynamicArgs.push(arg.getText())
            }
        }

        const warnings: string[] = []
        let staticObj: Record<string, any> = {}

        if (staticClassNames.length > 0) {
            const tokens = context.analyzer.analyze(staticClassNames)
            tokens.forEach((t) => {
                if (t.warning) warnings.push(t.warning)
            })
            staticObj = context.analyzer.buildObjectTree(tokens, {
                outputMode: context.outputMode,
            })
        }

        const propertyCount = Object.keys(staticObj).length
        const threshold = this.config.objectThreshold ?? 0
        const hasStatic = propertyCount > 0
        const hasDynamic = dynamicArgs.length > 0

        let finalReplacement = ""

        if (hasStatic && hasDynamic) {
            if (propertyCount >= threshold) {
                const componentName = getEnclosingComponentName(node)
                const tagName = getTagName(node)
                const constantName = context.styles.getOrRegister(
                    staticObj,
                    node,
                    componentName,
                    tagName
                )
                finalReplacement = `${constantName}.class(${dynamicArgs.join(", ")})`
            } else {
                const combinedStatic = staticClassNames.join(" ")
                finalReplacement = `${context.tailwindestIdentifier}.join("${combinedStatic}", ${dynamicArgs.join(", ")})`
            }
        } else if (hasStatic && !hasDynamic) {
            if (propertyCount >= threshold) {
                const componentName = getEnclosingComponentName(node)
                const tagName = getTagName(node)
                const constantName = context.styles.getOrRegister(
                    staticObj,
                    node,
                    componentName,
                    tagName
                )
                finalReplacement = `${constantName}.class()`
            } else {
                finalReplacement = `${context.tailwindestIdentifier}.join("${staticClassNames.join(" ")}")`
            }
        } else if (!hasStatic && hasDynamic) {
            finalReplacement = `${context.tailwindestIdentifier}.join(${dynamicArgs.join(", ")})`
        } else {
            // Nothing resolved
            finalReplacement = `""`
        }

        const original = node.getText()
        const callName = node.getExpression().getText()
        node.replaceWithText(finalReplacement)

        // Context updates
        context.imports.addNamedImport(
            context.tailwindestModulePath,
            context.tailwindestIdentifier
        )
        context.imports.registerToRemove(callName)

        return {
            success: true,
            location,
            original,
            transformed: finalReplacement,
            warnings,
        }
    }
}
