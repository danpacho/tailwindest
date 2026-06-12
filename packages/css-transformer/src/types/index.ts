export interface ParsedToken {
    original: string
    utility: string
    property: string | null
    variants: string[]
    warning?: string
}

export type PreservedTokenReason =
    | "unresolved-property"
    | "unsafe-serialization"
    | "unsupported-conditional"

export interface StructuredClassToken extends ParsedToken {
    kind: "structured"
    index: number
    property: string
}

export interface PreservedClassToken extends ParsedToken {
    kind: "preserved"
    index: number
    property: null
    reason: PreservedTokenReason
}

export type ClassSourceToken = StructuredClassToken | PreservedClassToken

export interface ClassSourcePlan {
    source: string
    tokens: ClassSourceToken[]
    structuredTokens: StructuredClassToken[]
    preservedTokens: PreservedClassToken[]
    styleTree: Record<string, any>
}

export interface TransformResult {
    success: boolean
    location: { line: number; column: number }
    original: string
    transformed: string
    warnings: string[]
}

export interface Diagnostic {
    level: "info" | "warning" | "error"
    walkerName: string
    message: string
    location?: { line: number; column: number }
}
