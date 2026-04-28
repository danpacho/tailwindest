import type { CompilerDiagnostic } from "./core/diagnostic_types"
import type { MergerPolicy } from "./core/merger"
import type { ViteSourceMap } from "./transform/replacement"
import { createCompilerContext } from "./vite/context"

/**
 * Controls how the compiler handles values that cannot be proven static.
 *
 * - `"strict"` fails compilation for unsupported dynamic values.
 * - `"loose"` keeps the original runtime call in place and still reports
 *   diagnostics/candidates for debug and Tailwind source generation.
 *
 * Use `"strict"` for production CI gates and `"loose"` while migrating a
 * codebase or intentionally preserving a small runtime fallback.
 *
 * @public
 */
export type CompileMode = "strict" | "loose"

/**
 * Options for compiling one TypeScript/JavaScript source string with the
 * Tailwindest zero-runtime compiler.
 *
 * This API is intentionally file-local. Vite projects should prefer the
 * `tailwindest()` plugin from `@tailwindest/compiler/vite`, because the plugin
 * owns manifest state, HMR invalidation, and Tailwind CSS `@source inline()`
 * injection across the whole module graph.
 *
 * @public
 */
export interface CompileOptions {
    /**
     * Stable source id used for diagnostics, replacement spans, source maps,
     * and Tailwindest include/exclude matching.
     *
     * @defaultValue `"/tailwindest-entry.tsx"`
     */
    fileName?: string

    /**
     * Project root used for path normalization.
     *
     * @defaultValue `process.cwd()`
     */
    root?: string

    /**
     * Unsupported-value policy for the compile operation.
     *
     * @defaultValue `"strict"`
     */
    mode?: CompileMode

    /**
     * Emit a Vite-compatible source map that maps every exact replacement back
     * to the original Tailwindest call span.
     *
     * @defaultValue `false`
     */
    sourceMap?: boolean

    /**
     * Maximum number of static variant combinations that may be materialized
     * into a generated lookup table before the compiler reports
     * `VARIANT_TABLE_LIMIT_EXCEEDED`.
     */
    variantTableLimit?: number

    /**
     * Build-time class merge policy. The default policy preserves class order
     * without invoking a runtime merger.
     */
    merger?: MergerPolicy
}

/**
 * Result of compiling a single source string.
 *
 * The returned `code` is safe to pass to a bundler. `candidates` must be fed to
 * Tailwind CSS, normally through the Vite manifest bridge, when this low-level
 * API is used outside the official plugin.
 *
 * @public
 */
export interface CompileResult {
    /**
     * Transformed JavaScript/TypeScript source. Exact Tailwindest calls are
     * replaced with runtime-free string literals or deterministic lookup code.
     */
    code: string

    /**
     * Vite-compatible source map, or `null` when source maps are disabled or no
     * exact replacement was emitted.
     */
    map: ViteSourceMap | null

    /**
     * Static Tailwind class candidates discovered during analysis and
     * replacement generation.
     */
    candidates: string[]

    /**
     * Diagnostics emitted while resolving, evaluating, and substituting
     * Tailwindest calls.
     */
    diagnostics: CompilerDiagnostic[]

    /**
     * Whether the output `code` differs from the input source.
     */
    changed: boolean
}

/**
 * Compile one source file with the Tailwindest zero-runtime compiler.
 *
 * This is the stable programmatic entry point for build tools that cannot use
 * the Vite plugin. It performs the same evaluator and replacement pass used by
 * the plugin, but it does not write debug manifests and does not inject
 * Tailwind CSS `@source inline()` rules. Callers are responsible for forwarding
 * `result.candidates` into their CSS build pipeline.
 *
 * @example
 * ```ts
 * import { compile } from "@tailwindest/compiler"
 *
 * const result = compile(source, {
 *   fileName: "/repo/src/button.tsx",
 *   mode: "strict",
 *   sourceMap: true,
 * })
 * ```
 *
 * @throws Error when `mode` is `"strict"` and the source contains a
 * Tailwindest call that cannot be compiled exactly.
 *
 * @public
 */
export function compile(
    source: string,
    options: CompileOptions = {}
): CompileResult {
    const fileName = options.fileName ?? "/tailwindest-entry.tsx"
    const compilerOptions = {
        include: [fileName],
        mode: options.mode ?? "strict",
        ...(options.sourceMap === undefined
            ? {}
            : { sourceMap: options.sourceMap }),
        ...(options.variantTableLimit === undefined
            ? {}
            : { variantTableLimit: options.variantTableLimit }),
        ...(options.merger === undefined ? {} : { merger: options.merger }),
    }
    const context = createCompilerContext({
        root: options.root ?? process.cwd(),
        options: compilerOptions,
    })
    const result = context.transformJs(source, fileName)

    return {
        code: result.code,
        map: result.map,
        candidates: result.candidates,
        diagnostics: result.diagnostics,
        changed: result.changed,
    }
}

/**
 * Diagnostic codes, severities, and the minimal diagnostic shape shared by all
 * compiler entry points.
 *
 * @public
 */
export type {
    CompilerDiagnostic,
    CompilerDiagnosticCode,
    CompilerDiagnosticSeverity,
} from "./core/diagnostic_types"

/**
 * Static style value shapes accepted by the low-level evaluator and compiler
 * APIs.
 *
 * @public
 */
export type {
    StaticClassDictionary,
    StaticClassValue,
    StaticStyleObject,
    StaticStyleValue,
} from "./core/static_value"

/**
 * Build-time class merge configuration and evaluation result types.
 *
 * @public
 */
export type {
    EvaluationFallback,
    EvaluationMode,
    EvaluationOptions,
    EvaluationResult,
    MergerPolicy,
} from "./core/merger"

/**
 * Public evaluator helpers for deterministic Tailwind class flattening and
 * style-object merging.
 *
 * @public
 */
export {
    createEvaluationEngine,
    deepMerge,
    flattenRecord,
    getClassName,
} from "./core/evaluator"
export type { EvaluationEngine } from "./core/evaluator"
export { defaultMerge, evaluateMergerPolicy } from "./core/merger"

/**
 * Advanced per-call compiler API. Most integrations should use `compile()` or
 * the Vite plugin instead.
 *
 * @public
 */
export { compileTailwindestCall } from "./core/api_compile"
export type {
    ApiCompileInput,
    ApiCompileResult,
    CompileValue,
    DynamicExpression,
    DynamicVariantProps,
    StaticCompileValue,
    UnsupportedCompileValue,
    VariantPropsValue,
} from "./core/api_compile"

/**
 * Runtime-free generated expression shape returned by low-level compile APIs.
 *
 * @public
 */
export type { GeneratedExpression } from "./core/codegen"

/**
 * Source span and replacement-plan shapes used by advanced compiler APIs.
 *
 * @public
 */
export type { SourceSpan } from "./analyzer/symbols"
export type { ReplacementPlan } from "./transform/replacement"

/**
 * Rich diagnostic and debug manifest contracts used by the Vite plugin and
 * external debug tooling.
 *
 * @public
 */
export type {
    DiagnosticModeBehavior,
    RichCompilerDiagnostic,
    TailwindestMode,
} from "./debug/diagnostics"
export type {
    TailwindestDebugFile,
    TailwindestDebugManifest,
    TailwindestDebugReplacement,
} from "./debug/debug_manifest"

/**
 * Source-map shape emitted by the compiler.
 *
 * @public
 */
export type { ViteSourceMap } from "./transform/replacement"
