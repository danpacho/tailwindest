import type { SourceSpan } from "../analyzer/symbols"
import type {
    CompilerDiagnostic,
    CompilerDiagnosticCode,
    CompilerDiagnosticSeverity,
} from "../core/diagnostic_types"

/**
 * Runtime fallback behavior attached to rich diagnostics.
 *
 * @public
 */
export type DiagnosticFallbackBehavior = "runtime-fallback" | "informational"

/**
 * Diagnostic shape written to debug manifests.
 *
 * Every debug diagnostic has source location data so dev, debug, and build
 * traces are reproducible from emitted artifacts.
 *
 * @public
 */
export interface RichCompilerDiagnostic extends CompilerDiagnostic {
    severity: CompilerDiagnosticSeverity
    fallbackBehavior: DiagnosticFallbackBehavior
    file: string
    span: SourceSpan
    suggestion?: string
}

export interface CreateRichDiagnosticInput {
    code: CompilerDiagnosticCode
    severity: CompilerDiagnosticSeverity
    fallbackBehavior: DiagnosticFallbackBehavior
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
        fallbackBehavior: input.fallbackBehavior,
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
    fallbackBehavior: DiagnosticFallbackBehavior = defaultFallbackBehavior(
        diagnostic
    )
): RichCompilerDiagnostic {
    return createRichDiagnostic({
        code: diagnostic.code,
        severity: diagnostic.severity,
        fallbackBehavior,
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

export function diagnosticsForRuntimeFallback(
    diagnostics: RichCompilerDiagnostic[]
): {
    diagnostics: RichCompilerDiagnostic[]
    shouldFallback: boolean
} {
    const sorted = sortDiagnostics(diagnostics)
    return {
        diagnostics: sorted,
        shouldFallback: sorted.some(
            (item) => item.fallbackBehavior === "runtime-fallback"
        ),
    }
}

function defaultFallbackBehavior(
    diagnostic: CompilerDiagnostic
): DiagnosticFallbackBehavior {
    if (diagnostic.severity === "info") {
        return "informational"
    }
    return "runtime-fallback"
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
