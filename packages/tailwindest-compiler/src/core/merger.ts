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
 * Reason a value was preserved for runtime fallback.
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
const CLASS_TOKEN_SEPARATOR = /\s+/

/**
 * Split a class string into non-empty Tailwind candidate tokens.
 *
 * @public
 */
export function candidatesFromClassName(className: string): string[] {
    return className
        .split(CLASS_TOKEN_SEPARATOR)
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
    policy: MergerPolicy
): EvaluationResult<string> {
    const value = defaultMerge(flattenMergerClassValues(classList))
    return applyMergerPolicy(value, policy)
}

export function applyMergerPolicy(
    value: string,
    policy: MergerPolicy
): EvaluationResult<string> {
    const candidates = candidatesFromClassName(value)

    if (policy.kind === "none") {
        return {
            value,
            candidates,
            diagnostics: [],
            exact: true,
        }
    }

    if (policy.kind === "unsupported") {
        return unsafeMergerResult(value, candidates, {
            code: "UNSUPPORTED_MERGER",
            message: policy.reason,
            severity: "warning",
        })
    }

    if (policy.kind === "known" && policy.configHash.length === 0) {
        return unsafeMergerResult(value, candidates, {
            code: "MERGER_CONFIG_MISSING",
            message: "Known merger policy requires a stable config hash.",
            severity: "warning",
        })
    }

    return unsafeMergerResult(value, candidates, {
        code: "NON_DETERMINISTIC_MERGER",
        message: "No equivalent build-time merger evaluator is available.",
        severity: "warning",
    })
}

function unsafeMergerResult(
    value: string,
    candidates: string[],
    diagnostic: CompilerDiagnostic
): EvaluationResult<string> {
    return {
        value,
        candidates,
        diagnostics: [diagnostic],
        exact: false,
        fallback: {
            reason: diagnostic.message,
        },
    }
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
