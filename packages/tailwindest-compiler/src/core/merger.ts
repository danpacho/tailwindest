import type { CompilerDiagnostic } from "./diagnostic_types"

/**
 * Build-time class merge policy.
 *
 * `kind: "none"` preserves class order and performs no semantic Tailwind merge.
 * Other policies must be deterministic at build time or they produce fallback
 * diagnostics so runtime and production CSS cannot drift silently.
 *
 * @public
 */
export type MergerPolicy =
    | { kind: "none" }
    | { kind: "known"; name: "tailwind-merge"; configHash: string }
    | {
          kind: "custom"
          evaluateAtBuildTime: true
          moduleId: string
          exportName: string
      }
    | { kind: "unsupported"; reason: string }

/**
 * Evaluation mode used by low-level compiler APIs.
 *
 * @public
 */
export type EvaluationMode = "strict" | "loose"

/**
 * Options shared by class merge and evaluation helpers.
 *
 * @public
 */
export interface EvaluationOptions {
    /**
     * Unsupported-value policy for low-level evaluation helpers.
     *
     * @defaultValue `"loose"`
     */
    mode?: EvaluationMode
}

/**
 * Reason a value was preserved for runtime fallback in loose mode.
 *
 * @public
 */
export interface EvaluationFallback {
    reason: string
}

/**
 * Deterministic evaluation result returned by build-time helpers.
 *
 * @public
 */
export interface EvaluationResult<T> {
    value: T
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
    exact: boolean
    fallback?: EvaluationFallback
}

type MergerClassValue = string | readonly MergerClassValue[]

/**
 * Split a class string into non-empty Tailwind candidate tokens.
 *
 * @public
 */
export function candidatesFromClassName(className: string): string[] {
    return className
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
}

/**
 * Deterministically join class tokens without semantic conflict resolution.
 *
 * @public
 */
export function defaultMerge(classList: readonly string[]): string {
    return classList
        .flatMap((token) => token.split(" "))
        .filter((token) => token && token.length > 0)
        .map((token) => token.trim())
        .join(" ")
        .trim()
}

/**
 * Evaluate a class list with a merge policy and return candidates/diagnostics.
 *
 * @public
 */
export function evaluateMergerPolicy(
    classList: readonly MergerClassValue[],
    policy: MergerPolicy,
    options: EvaluationOptions = {}
): EvaluationResult<string> {
    const value = defaultMerge(flattenMergerClassValues(classList))
    return applyMergerPolicy(value, policy, options)
}

export function applyMergerPolicy(
    value: string,
    policy: MergerPolicy,
    options: EvaluationOptions = {}
): EvaluationResult<string> {
    const candidates = candidatesFromClassName(value)
    const mode = options.mode ?? "loose"

    if (policy.kind === "none") {
        return {
            value,
            candidates,
            diagnostics: [],
            exact: true,
        }
    }

    if (policy.kind === "unsupported") {
        return unsafeMergerResult(value, candidates, mode, {
            code: "UNSUPPORTED_MERGER",
            message: policy.reason,
            severity: mode === "strict" ? "error" : "warning",
        })
    }

    if (policy.kind === "known" && policy.configHash.length === 0) {
        return unsafeMergerResult(value, candidates, mode, {
            code: "MERGER_CONFIG_MISSING",
            message: "Known merger policy requires a stable config hash.",
            severity: "error",
        })
    }

    return unsafeMergerResult(value, candidates, mode, {
        code: "NON_DETERMINISTIC_MERGER",
        message: "No equivalent build-time merger evaluator is available.",
        severity: mode === "strict" ? "error" : "warning",
    })
}

function unsafeMergerResult(
    value: string,
    candidates: string[],
    mode: EvaluationMode,
    diagnostic: CompilerDiagnostic
): EvaluationResult<string> {
    const result: EvaluationResult<string> = {
        value,
        candidates,
        diagnostics: [diagnostic],
        exact: false,
    }

    if (mode === "loose") {
        result.fallback = {
            reason: diagnostic.message,
        }
    }

    return result
}

function flattenMergerClassValues(
    values: readonly MergerClassValue[]
): string[] {
    const flattened: string[] = []

    for (const value of values) {
        if (typeof value === "string") {
            flattened.push(value)
        } else {
            flattened.push(...flattenMergerClassValues(value))
        }
    }

    return flattened
}
