import type { CompilerDiagnostic } from "./core/diagnostic_types"
import type { MergerPolicy } from "./core/merger"
import type { ViteSourceMap } from "./transform/replacement"
import { createCompilerContext } from "./vite/context"
import { loadTailwindNestGroups } from "tailwindest-tailwind-internal"
import { createCompiledVariantResolver } from "./core/compiled_variant_resolver"

/**
 * @deprecated Internal compiler experiment. `@tailwindest/compiler` is private
 * and must not be published.
 * @internal
 */

/**
 * Options for compiling one TypeScript/JavaScript source string with the
 * Tailwindest progressive compiler.
 *
 * @deprecated Internal compiler experiment.
 * @internal
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
 * @deprecated Internal compiler experiment.
 * @internal
 */
export interface CompileAsyncOptions extends CompileOptions {
    /**
     * Tailwind CSS entry file used to load the project design system for
     * nested shorthand variant compilation.
     */
    cssRoot?: string

    /**
     * Inline Tailwind CSS source used to load the project design system for
     * nested shorthand variant compilation.
     */
    cssSource?: string
}

/**
 * Result of compiling a single source string.
 *
 * @deprecated Internal compiler experiment.
 * @internal
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
 * Compile one source file with the Tailwindest progressive compiler.
 *
 * This was the programmatic entry point for internal build-tool experiments.
 * It performs the same evaluator and replacement pass used by the plugin, but
 * it does not write debug manifests and does not inject Tailwind CSS
 * `@source inline()` rules.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export function compile(
    source: string,
    options: CompileOptions = {}
): CompileResult {
    return compileWithResolver(source, options)
}

/**
 * @deprecated Internal compiler experiment.
 * @internal
 */
export async function compileAsync(
    source: string,
    options: CompileAsyncOptions = {}
): Promise<CompileResult> {
    const variantGroups =
        options.cssRoot === undefined && options.cssSource === undefined
            ? []
            : await loadTailwindNestGroups({
                  ...(options.cssRoot === undefined
                      ? {}
                      : { cssRoot: options.cssRoot }),
                  ...(options.cssSource === undefined
                      ? {}
                      : { cssSource: options.cssSource }),
              })
    return compileWithResolver(
        source,
        options,
        variantGroups.length > 0
            ? createCompiledVariantResolver(variantGroups)
            : undefined
    )
}

function compileWithResolver(
    source: string,
    options: CompileOptions,
    variantResolver?: ReturnType<typeof createCompiledVariantResolver>
): CompileResult {
    const fileName = options.fileName ?? "/tailwindest-entry.tsx"
    const compilerOptions = {
        include: [fileName],
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
        variantResolver,
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
 * @deprecated Internal compiler experiment.
 * @internal
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
 * @deprecated Internal compiler experiment.
 * @internal
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
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type {
    EvaluationFallback,
    EvaluationResult,
    MergerPolicy,
} from "./core/merger"

/**
 * Internal evaluator helpers for deterministic Tailwind class flattening and
 * style-object merging.
 *
 * @deprecated Internal compiler experiment.
 * @internal
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
 * Advanced per-call compiler API retained for internal compiler experiments.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export { compileTailwindestCall } from "./core/api_compile"
export { createCompiledVariantResolver } from "./core/compiled_variant_resolver"
export type {
    ApiCompileOptions,
    ApiCompileInput,
    ApiCompileResult,
    CompileValue,
    DynamicExpression,
    DynamicVariantProps,
    StaticCompileValue,
    UnsupportedCompileValue,
    VariantPropsValue,
} from "./core/api_compile"
export type { CompiledVariantResolver } from "./core/compiled_variant_resolver"

/**
 * Runtime-free generated expression shape returned by low-level compile APIs.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type { GeneratedExpression } from "./core/codegen"

/**
 * Source span and replacement-plan shapes used by advanced compiler APIs.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type { SourceSpan } from "./analyzer/symbols"
export type { ReplacementPlan } from "./transform/replacement"

/**
 * Rich diagnostic and debug manifest contracts used by the Vite plugin and
 * external debug tooling.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type {
    DiagnosticFallbackBehavior,
    RichCompilerDiagnostic,
} from "./debug/diagnostics"
export type {
    TailwindestDebugFile,
    TailwindestDebugManifest,
    TailwindestDebugReplacement,
} from "./debug/debug_manifest"

/**
 * Source-map shape emitted by the compiler.
 *
 * @deprecated Internal compiler experiment.
 * @internal
 */
export type { ViteSourceMap } from "./transform/replacement"
