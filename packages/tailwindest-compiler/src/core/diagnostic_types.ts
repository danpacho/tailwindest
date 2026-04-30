/**
 * Stable diagnostic code emitted by the Tailwindest compiler.
 *
 * Codes are designed for CI gates and debug tooling. Treat unknown future codes
 * as compiler diagnostics that should be displayed to users.
 *
 * @public
 */
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
    | "VARIANT_TABLE_LIMIT_EXCEEDED"
    | "MISSING_COMPILED_VARIANT_METADATA"
    | "TAILWIND_SOURCE_INJECTION_FAILED"
    | "HMR_INVALIDATION_UNCERTAIN"

/**
 * Severity level attached to every compiler diagnostic.
 *
 * @public
 */
export type CompilerDiagnosticSeverity = "error" | "warning" | "info"

/**
 * Minimal diagnostic shape shared by the core compiler, Vite integration, and
 * debug manifest.
 *
 * Rich debug diagnostics add source file and span information on top of this
 * base shape.
 *
 * @public
 */
export interface CompilerDiagnostic {
    code: CompilerDiagnosticCode
    message: string
    severity: CompilerDiagnosticSeverity
}
