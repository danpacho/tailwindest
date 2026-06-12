import type { Node } from "ts-morph"
import type { TransformerContext } from "../../context"
import type { ClassSourcePlan } from "../../types"
import { quoteClassLiteral } from "./class_literal"

export interface SerializedClassSource {
    code: string
    inputTokens: string[]
    outputTokens: string[]
    mode: "raw" | "style" | "def"
}

export interface SerializeClassSourceOptions {
    rawAsArgumentLiteral?: boolean
}

export function serializeClassSource(
    plan: ClassSourcePlan,
    context: TransformerContext,
    node: Node,
    objectThreshold: number,
    componentName?: string,
    tagName?: string,
    options: SerializeClassSourceOptions = {}
): SerializedClassSource {
    const inputTokens = plan.tokens.map((token) => token.original)
    const propertyCount = Object.keys(plan.styleTree).length
    const hasStructuredTokens = plan.structuredTokens.length > 0

    if (propertyCount < objectThreshold || !hasStructuredTokens) {
        const code = options.rawAsArgumentLiteral
            ? quoteClassLiteral(plan.source)
            : `${context.tailwindestIdentifier}.join(${quoteClassLiteral(plan.source)})`

        return {
            code,
            inputTokens,
            outputTokens: inputTokens,
            mode: "raw",
        }
    }

    const constantName = context.styles.getOrRegister(
        plan.styleTree,
        node,
        componentName,
        tagName
    )

    if (plan.preservedTokens.length === 0) {
        return {
            code: `${constantName}.class()`,
            inputTokens,
            outputTokens: inputTokens,
            mode: "style",
        }
    }

    const preservedTokens = plan.preservedTokens
        .map((token) => quoteClassLiteral(token.original))
        .join(", ")

    return {
        code: `${context.tailwindestIdentifier}.def([${preservedTokens}], ${constantName}.style())`,
        inputTokens,
        outputTokens: inputTokens,
        mode: "def",
    }
}
