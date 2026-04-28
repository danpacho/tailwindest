import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { SourceSpan, TailwindestCallKind } from "../analyzer/symbols"

export interface ReplacementPlan {
    span: SourceSpan
    text: string
    priority: number
    kind: TailwindestCallKind
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface ViteSourceMap {
    version: 3
    file: string
    sources: string[]
    sourcesContent?: string[]
    names: string[]
    mappings: string
}

export interface TransformResult {
    code: string
    map: ViteSourceMap | null
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
    changed: boolean
}
