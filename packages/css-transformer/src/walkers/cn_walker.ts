import { Node } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import type { ClassTransformerWalker } from "./walker_interface"
import { objectToString } from "./utils/object_to_string"

export class CnWalker implements ClassTransformerWalker {
    public readonly priority = 20
    public readonly name = "CnWalker"

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
            staticObj = context.analyzer.buildObjectTree(tokens)
        }

        const hasStatic = Object.keys(staticObj).length > 0
        const hasDynamic = dynamicArgs.length > 0

        let finalReplacement = ""

        if (hasStatic && hasDynamic) {
            finalReplacement = `${context.tailwindestIdentifier}.def([${dynamicArgs.join(", ")}], ${objectToString(staticObj, 4)})`
        } else if (hasStatic && !hasDynamic) {
            finalReplacement = `${context.tailwindestIdentifier}.style(${objectToString(staticObj, 4)}).class()`
        } else if (!hasStatic && hasDynamic) {
            finalReplacement = `${context.tailwindestIdentifier}.join(${dynamicArgs.join(", ")})`
        } else {
            // Nothing resolved (e.g., static but no resolvable tokens, though analyzer keeps unresolved as is)
            // But if we got here and nothing is there, fallback to empty string
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
