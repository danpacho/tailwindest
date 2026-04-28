export type CompilerDiagnosticCode =
    | "UNSUPPORTED_MERGER"
    | "NON_DETERMINISTIC_MERGER"
    | "MERGER_CONFIG_MISSING"
    | "NOT_TAILWINDEST_SYMBOL"
    | "UNRESOLVED_STATIC_VALUE"
    | "UNSUPPORTED_DYNAMIC_VALUE"
    | "UNKNOWN_SPREAD"
    | "MUTATED_BINDING"
    | "CIRCULAR_STATIC_REFERENCE"
    | "SIDE_EFFECTFUL_INITIALIZER"
    | "INVALID_REPLACEMENT_SPAN"
    | "INVALID_REPLACEMENT_SYNTAX"
    | "OVERLAPPING_REPLACEMENT"
    | "SOURCE_MAP_FAILED"
    | "IMPORT_CLEANUP_FAILED"

export type CompilerDiagnosticSeverity = "error" | "warning"

export interface CompilerDiagnostic {
    code: CompilerDiagnosticCode
    message: string
    severity: CompilerDiagnosticSeverity
}
