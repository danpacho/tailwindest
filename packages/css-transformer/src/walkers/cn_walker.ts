import { Node } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import { ClassTransformerWalker } from "./walker_interface"
import { serializeClassSource } from "./utils/class_source_serializer"
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
        const parts: Array<
            | { kind: "static"; className: string }
            | { kind: "dynamic"; code: string }
        > = []

        for (const arg of args) {
            if (
                Node.isStringLiteral(arg) ||
                Node.isNoSubstitutionTemplateLiteral(arg)
            ) {
                const className = arg.getLiteralText()
                staticClassNames.push(className)
                parts.push({ kind: "static", className })
            } else {
                const code = arg.getText()
                dynamicArgs.push(code)
                parts.push({ kind: "dynamic", code })
            }
        }

        const warnings: string[] = []
        const threshold = this.config.objectThreshold ?? 0
        const componentName = getEnclosingComponentName(node)
        const tagName = getTagName(node)

        const serializeStaticClassNames = (
            classNames: string[],
            rawAsArgumentLiteral: boolean
        ) => {
            const plan = context.analyzer.plan(classNames)
            plan.tokens.forEach((t) => {
                if (t.warning) warnings.push(t.warning)
            })
            if (plan.tokens.length === 0) return null
            return serializeClassSource(
                plan,
                context,
                node,
                threshold,
                componentName,
                tagName,
                { rawAsArgumentLiteral }
            )
        }

        const hasDynamic = dynamicArgs.length > 0
        const firstDynamicIndex = parts.findIndex(
            (part) => part.kind === "dynamic"
        )
        const hasStaticAfterDynamic =
            firstDynamicIndex !== -1 &&
            parts
                .slice(firstDynamicIndex + 1)
                .some((part) => part.kind === "static")

        let finalReplacement = ""

        if (hasStaticAfterDynamic) {
            const joinArgs: string[] = []
            let pendingStaticClassNames: string[] = []

            const flushStaticClassNames = () => {
                if (pendingStaticClassNames.length === 0) return

                const serialized = serializeStaticClassNames(
                    pendingStaticClassNames,
                    true
                )
                if (serialized) joinArgs.push(serialized.code)
                pendingStaticClassNames = []
            }

            for (const part of parts) {
                if (part.kind === "static") {
                    pendingStaticClassNames.push(part.className)
                } else {
                    flushStaticClassNames()
                    joinArgs.push(part.code)
                }
            }

            flushStaticClassNames()

            finalReplacement =
                joinArgs.length > 0
                    ? `${context.tailwindestIdentifier}.join(${joinArgs.join(", ")})`
                    : `""`
        } else {
            const serializedStatic =
                staticClassNames.length > 0
                    ? serializeStaticClassNames(staticClassNames, hasDynamic)
                    : null

            if (serializedStatic && hasDynamic) {
                finalReplacement = `${context.tailwindestIdentifier}.join(${serializedStatic.code}, ${dynamicArgs.join(", ")})`
            } else if (serializedStatic && !hasDynamic) {
                finalReplacement = serializedStatic.code
            } else if (!serializedStatic && hasDynamic) {
                finalReplacement = `${context.tailwindestIdentifier}.join(${dynamicArgs.join(", ")})`
            } else {
                // Nothing resolved
                finalReplacement = `""`
            }
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
