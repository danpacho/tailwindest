import { Node } from "ts-morph"
import type { TransformerContext } from "../context"
import type { TransformResult } from "../types"
import { ClassTransformerWalker } from "./walker_interface"
import { serializeClassSource } from "./utils/class_source_serializer"
import { getEnclosingComponentName, getTagName } from "./utils/naming"

export interface ClassNameWalkerConfig {
    /**
     * Minimum number of resolved CSS properties required to generate a style object.
     * If the number of properties is below this threshold, raw strings will be used via `tw.join`.
     * @default 0
     */
    objectThreshold?: number
}

export class ClassNameWalker implements ClassTransformerWalker {
    public readonly priority = 30
    public readonly name = "ClassNameWalker"

    constructor(private readonly config: ClassNameWalkerConfig = {}) {}

    public canWalk(node: Node): boolean {
        if (!Node.isJsxAttribute(node)) return false

        const name = node.getNameNode().getText()
        if (name !== "className") return false

        const init = node.getInitializer()
        if (!init) return false

        // className="flex text-sm"
        if (Node.isStringLiteral(init)) return true

        // className={"flex text-sm"} or className={`flex text-sm`} without substitutions
        if (Node.isJsxExpression(init)) {
            const expr = init.getExpression()
            if (
                expr &&
                (Node.isStringLiteral(expr) ||
                    Node.isNoSubstitutionTemplateLiteral(expr))
            ) {
                return true
            }
        }

        return false
    }

    public walk(node: Node, context: TransformerContext): TransformResult {
        if (!Node.isJsxAttribute(node)) {
            throw new Error("Node is not a JsxAttribute")
        }

        const init = node.getInitializer()!
        let classString = ""

        if (Node.isStringLiteral(init)) {
            classString = init.getLiteralText()
        } else if (Node.isJsxExpression(init)) {
            const expr = init.getExpression()!
            if (
                Node.isStringLiteral(expr) ||
                Node.isNoSubstitutionTemplateLiteral(expr)
            ) {
                classString = expr.getLiteralText()
            }
        }

        const location = {
            line: node.getStartLineNumber(),
            column: node.getStartLinePos(),
        }

        if (!classString.trim()) {
            return {
                success: false,
                location,
                original: node.getText(),
                transformed: node.getText(),
                warnings: ["Empty className string"],
            }
        }

        const plan = context.analyzer.plan(classString)
        const warnings: string[] = []
        plan.tokens.forEach((t) => {
            if (t.warning) warnings.push(t.warning)
        })

        const threshold = this.config.objectThreshold ?? 0
        const componentName = getEnclosingComponentName(node)
        const tagName = getTagName(node)
        const serialized = serializeClassSource(
            plan,
            context,
            node,
            threshold,
            componentName,
            tagName
        )
        const twCall = serialized.code
        const finalReplacement = `className={${twCall}}`

        const original = node.getText()
        node.replaceWithText(finalReplacement)

        // Context updates
        context.imports.addNamedImport(
            context.tailwindestModulePath,
            context.tailwindestIdentifier
        )

        return {
            success: true,
            location,
            original,
            transformed: finalReplacement,
            warnings,
        }
    }
}
