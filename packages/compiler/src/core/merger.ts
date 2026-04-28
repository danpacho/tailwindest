import type { CompilerDiagnostic } from "./diagnostic_types"

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

export type EvaluationMode = "strict" | "loose"

export interface EvaluationOptions {
    mode?: EvaluationMode
}

export interface EvaluationFallback {
    reason: string
}

export interface EvaluationResult<T> {
    value: T
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
    exact: boolean
    fallback?: EvaluationFallback
}

type MergerClassValue = string | readonly MergerClassValue[]

export function candidatesFromClassName(className: string): string[] {
    return className
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
}

export function defaultMerge(classList: readonly string[]): string {
    return classList
        .flatMap((token) => token.split(" "))
        .filter((token) => token && token.length > 0)
        .map((token) => token.trim())
        .join(" ")
        .trim()
}

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
    const mode = options.mode ?? "strict"

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
