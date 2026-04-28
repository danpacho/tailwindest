import type { SourceSpan } from "../analyzer/symbols"
import type {
    CompilerDiagnostic,
    CompilerDiagnosticCode,
    CompilerDiagnosticSeverity,
} from "../core/diagnostic_types"

export type TailwindestMode = "strict" | "loose"

export type DiagnosticModeBehavior =
    | "strict-fails"
    | "loose-fallback"
    | "informational"

export interface RichCompilerDiagnostic extends CompilerDiagnostic {
    severity: CompilerDiagnosticSeverity
    modeBehavior: DiagnosticModeBehavior
    file: string
    span: SourceSpan
    suggestion?: string
}

export interface CreateRichDiagnosticInput {
    code: CompilerDiagnosticCode
    severity: CompilerDiagnosticSeverity
    modeBehavior: DiagnosticModeBehavior
    file: string
    span: SourceSpan
    message: string
    suggestion?: string
}

export const REQUIRED_DIAGNOSTIC_CODES: CompilerDiagnosticCode[] = [
    "UNSUPPORTED_DYNAMIC_VALUE",
    "UNSUPPORTED_MERGER",
    "UNKNOWN_SPREAD",
    "MUTATED_BINDING",
    "CIRCULAR_STATIC_REFERENCE",
    "OVERLAPPING_REPLACEMENT",
    "SOURCE_MAP_FAILED",
    "VARIANT_TABLE_LIMIT_EXCEEDED",
    "TAILWIND_SOURCE_INJECTION_FAILED",
    "HMR_INVALIDATION_UNCERTAIN",
]

export function createRichDiagnostic(
    input: CreateRichDiagnosticInput
): RichCompilerDiagnostic {
    return {
        code: input.code,
        severity: input.severity,
        modeBehavior: input.modeBehavior,
        file: input.file,
        span: input.span,
        message: input.message,
        ...(input.suggestion ? { suggestion: input.suggestion } : {}),
    }
}

export function diagnosticWithSource(
    diagnostic: CompilerDiagnostic,
    file: string,
    span: SourceSpan,
    modeBehavior: DiagnosticModeBehavior = defaultModeBehavior(diagnostic)
): RichCompilerDiagnostic {
    return createRichDiagnostic({
        code: diagnostic.code,
        severity: diagnostic.severity,
        modeBehavior,
        file,
        span,
        message: diagnostic.message,
    })
}

export function sortDiagnostics<T extends CompilerDiagnostic>(
    diagnostics: T[]
): T[] {
    return [...diagnostics].sort(compareDiagnostics)
}

export function compareDiagnostics(
    left: CompilerDiagnostic,
    right: CompilerDiagnostic
): number {
    return (
        getDiagnosticFile(left).localeCompare(getDiagnosticFile(right)) ||
        getDiagnosticStart(left) - getDiagnosticStart(right) ||
        getDiagnosticEnd(left) - getDiagnosticEnd(right) ||
        left.code.localeCompare(right.code) ||
        left.message.localeCompare(right.message) ||
        left.severity.localeCompare(right.severity)
    )
}

export function diagnosticsForMode(
    diagnostics: RichCompilerDiagnostic[],
    mode: TailwindestMode
): {
    diagnostics: RichCompilerDiagnostic[]
    shouldFail: boolean
    shouldFallback: boolean
} {
    const sorted = sortDiagnostics(diagnostics)
    return {
        diagnostics: sorted,
        shouldFail:
            mode === "strict" &&
            sorted.some((item) => item.modeBehavior === "strict-fails"),
        shouldFallback:
            mode === "loose" &&
            sorted.some(
                (item) =>
                    item.modeBehavior === "strict-fails" ||
                    item.modeBehavior === "loose-fallback"
            ),
    }
}

function defaultModeBehavior(
    diagnostic: CompilerDiagnostic
): DiagnosticModeBehavior {
    if (diagnostic.severity === "info") {
        return "informational"
    }
    return diagnostic.severity === "error" ? "strict-fails" : "loose-fallback"
}

function getDiagnosticFile(diagnostic: CompilerDiagnostic): string {
    return "file" in diagnostic && typeof diagnostic.file === "string"
        ? diagnostic.file
        : ""
}

function getDiagnosticStart(diagnostic: CompilerDiagnostic): number {
    return getDiagnosticSpanNumber(diagnostic, "start")
}

function getDiagnosticEnd(diagnostic: CompilerDiagnostic): number {
    return getDiagnosticSpanNumber(diagnostic, "end")
}

function getDiagnosticSpanNumber(
    diagnostic: CompilerDiagnostic,
    key: "start" | "end"
): number {
    const span =
        "span" in diagnostic &&
        diagnostic.span &&
        typeof diagnostic.span === "object"
            ? (diagnostic.span as Partial<SourceSpan>)
            : undefined
    if (span && key in span && typeof span[key] === "number") {
        return span[key]
    }
    return 0
}
