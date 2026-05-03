import type { CompilerDiagnostic } from "../core/diagnostic_types"
import type { SourceSpan, TailwindestCallKind } from "../analyzer/symbols"

/**
 * Reverse-executed source replacement plan.
 *
 * Plans are sorted and applied by the substitutor so large files can be
 * transformed without invalidating earlier byte offsets.
 *
 * @public
 */
export interface ReplacementPlan {
    span: SourceSpan
    text: string
    priority: number
    kind: TailwindestCallKind
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

/**
 * Vite-compatible source map emitted by Tailwindest replacement passes.
 *
 * @public
 */
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
    skippedSpans?: SourceSpan[]
}
