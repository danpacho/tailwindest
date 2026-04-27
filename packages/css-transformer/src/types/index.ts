export interface ParsedToken {
    original: string
    utility: string
    property: string | null
    variants: string[]
    warning?: string
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
