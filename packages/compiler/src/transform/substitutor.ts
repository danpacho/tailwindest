import * as ts from "typescript"
import type { CompilerDiagnostic } from "../core/diagnostic_types"
import {
    cleanupRuntimeImports,
    type ImportCleanupInput,
    type ImportCleanupResult,
} from "./import_cleanup"
import {
    createReplacementSourceMap,
    type ReplacementSourceMapInput,
} from "./source_map"
import type {
    ReplacementPlan,
    TransformResult,
    ViteSourceMap,
} from "./replacement"

export interface SubstituteTailwindestInput {
    fileName: string
    code: string
    plans: ReplacementPlan[]
    cleanImports?: boolean
    sourceMapMode?: "strict" | "loose" | false
    cleanupImports?: (input: ImportCleanupInput) => ImportCleanupResult
    createSourceMap?: (input: ReplacementSourceMapInput) => ViteSourceMap
}

export const substituteTailwindest = ({
    fileName,
    code,
    plans,
    cleanImports = false,
    sourceMapMode = false,
    cleanupImports = cleanupRuntimeImports,
    createSourceMap = createReplacementSourceMap,
}: SubstituteTailwindestInput): TransformResult => {
    const diagnostics: CompilerDiagnostic[] = []
    const fallbackPlans = plans.filter((plan) => plan.diagnostics.length > 0)
    diagnostics.push(...fallbackPlans.flatMap((plan) => plan.diagnostics))

    const replacementPlans = plans.filter(
        (plan) => plan.diagnostics.length === 0
    )
    const invalidPlan = replacementPlans.find(
        (plan) => !isValidSpan(code, fileName, plan)
    )
    if (invalidPlan) {
        return unchanged(code, [
            ...diagnostics,
            diagnostic(
                "INVALID_REPLACEMENT_SPAN",
                `Invalid replacement span ${invalidPlan.span.start}:${invalidPlan.span.end}.`
            ),
        ])
    }

    try {
        const protectedResult = removeProtectedOverlaps(
            replacementPlans,
            fallbackPlans
        )
        diagnostics.push(...protectedResult.diagnostics)

        const resolved = resolveOverlaps(protectedResult.plans)
        diagnostics.push(...resolved.diagnostics)
        const appliedPlans = resolved.plans
        const replacedCode = applyReplacements(code, appliedPlans)

        if (hasSyntaxError(fileName, replacedCode)) {
            return unchanged(code, [
                ...diagnostics,
                diagnostic(
                    "INVALID_REPLACEMENT_SYNTAX",
                    "Generated replacement code contains a syntax error."
                ),
            ])
        }

        let finalCode = replacedCode
        if (cleanImports) {
            let cleanup: ImportCleanupResult
            try {
                cleanup = cleanupImports({ fileName, code: finalCode })
            } catch (error) {
                return unchanged(code, [
                    ...diagnostics,
                    diagnostic(
                        "IMPORT_CLEANUP_FAILED",
                        error instanceof Error
                            ? error.message
                            : "Import cleanup failed."
                    ),
                ])
            }

            if (
                cleanup.diagnostics.some(
                    (item) => item.code === "IMPORT_CLEANUP_FAILED"
                )
            ) {
                return unchanged(code, [...diagnostics, ...cleanup.diagnostics])
            }

            finalCode = cleanup.code
            diagnostics.push(...cleanup.diagnostics)
        }

        let map: ViteSourceMap | null = null
        if (sourceMapMode) {
            try {
                map = createSourceMap({
                    fileName,
                    originalCode: code,
                    generatedCode: finalCode,
                    replacements: appliedPlans,
                })
            } catch (error) {
                const mapDiagnostic = diagnostic(
                    "SOURCE_MAP_FAILED",
                    error instanceof Error
                        ? error.message
                        : "Source map generation failed."
                )
                if (sourceMapMode === "strict") {
                    return unchanged(code, [...diagnostics, mapDiagnostic])
                }
                diagnostics.push(mapDiagnostic)
            }
        }

        return {
            code: finalCode,
            map,
            candidates: collectCandidates(appliedPlans),
            diagnostics,
            changed: finalCode !== code,
        }
    } catch (error) {
        return unchanged(code, [
            ...diagnostics,
            diagnostic(
                "INVALID_REPLACEMENT_SYNTAX",
                error instanceof Error ? error.message : "Replacement failed."
            ),
        ])
    }
}

interface ResolvedPlans {
    plans: ReplacementPlan[]
    diagnostics: CompilerDiagnostic[]
}

const removeProtectedOverlaps = (
    plans: ReplacementPlan[],
    protectedPlans: ReplacementPlan[]
): ResolvedPlans => {
    if (plans.length === 0 || protectedPlans.length === 0) {
        return { plans, diagnostics: [] }
    }

    const accepted: ReplacementPlan[] = []
    const diagnostics: CompilerDiagnostic[] = []

    for (const plan of plans) {
        if (
            protectedPlans.some((protectedPlan) =>
                spansOverlap(plan, protectedPlan)
            )
        ) {
            diagnostics.push(
                diagnostic(
                    "OVERLAPPING_REPLACEMENT",
                    "Replacement overlaps a protected fallback span."
                )
            )
            continue
        }

        accepted.push(plan)
    }

    return { plans: accepted, diagnostics }
}

const resolveOverlaps = (plans: ReplacementPlan[]): ResolvedPlans => {
    if (plans.length < 2) {
        return { plans, diagnostics: [] }
    }

    const sorted = [...plans].sort(
        (left, right) =>
            left.span.start - right.span.start || right.span.end - left.span.end
    )
    const clusters: ReplacementPlan[][] = []
    let current: ReplacementPlan[] = []
    let currentEnd = -1

    for (const plan of sorted) {
        if (current.length === 0 || plan.span.start < currentEnd) {
            current.push(plan)
            currentEnd = Math.max(currentEnd, plan.span.end)
            continue
        }
        clusters.push(current)
        current = [plan]
        currentEnd = plan.span.end
    }

    if (current.length > 0) {
        clusters.push(current)
    }

    const accepted: ReplacementPlan[] = []
    const diagnostics: CompilerDiagnostic[] = []

    for (const cluster of clusters) {
        if (cluster.length === 1) {
            accepted.push(cluster[0]!)
            continue
        }

        const safeOuter = chooseSafeOuter(cluster)
        if (safeOuter) {
            accepted.push(safeOuter)
            continue
        }

        diagnostics.push(
            diagnostic(
                "OVERLAPPING_REPLACEMENT",
                "Overlapping replacements could not be proven safe."
            )
        )
    }

    return { plans: accepted, diagnostics }
}

const spansOverlap = (
    left: ReplacementPlan,
    right: ReplacementPlan
): boolean => {
    return (
        left.span.fileName === right.span.fileName &&
        left.span.start < right.span.end &&
        right.span.start < left.span.end
    )
}

const chooseSafeOuter = (
    cluster: ReplacementPlan[]
): ReplacementPlan | undefined => {
    return cluster.find((candidate) => {
        const innerPlans = cluster.filter((plan) => plan !== candidate)
        if (
            !innerPlans.every(
                (plan) =>
                    candidate.span.start <= plan.span.start &&
                    candidate.span.end >= plan.span.end
            )
        ) {
            return false
        }

        const candidateClasses = new Set(candidate.candidates)
        return innerPlans.every((plan) =>
            plan.candidates.every((className) =>
                candidateClasses.has(className)
            )
        )
    })
}

const applyReplacements = (code: string, plans: ReplacementPlan[]): string => {
    let next = code
    for (const plan of [...plans].sort(
        (left, right) => right.span.start - left.span.start
    )) {
        next =
            next.slice(0, plan.span.start) +
            plan.text +
            next.slice(plan.span.end)
    }
    return next
}

const collectCandidates = (plans: ReplacementPlan[]): string[] => {
    const seen = new Set<string>()
    const candidates: string[] = []

    for (const plan of [...plans].sort(
        (left, right) => left.span.start - right.span.start
    )) {
        for (const className of plan.candidates) {
            if (seen.has(className)) {
                continue
            }
            seen.add(className)
            candidates.push(className)
        }
    }

    return candidates
}

const isValidSpan = (
    code: string,
    fileName: string,
    plan: ReplacementPlan
): boolean => {
    return (
        plan.span.fileName === fileName &&
        Number.isInteger(plan.span.start) &&
        Number.isInteger(plan.span.end) &&
        plan.span.start >= 0 &&
        plan.span.end >= plan.span.start &&
        plan.span.end <= code.length
    )
}

const hasSyntaxError = (fileName: string, code: string): boolean => {
    const output = ts.transpileModule(code, {
        fileName,
        reportDiagnostics: true,
        compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
        },
    })
    return (
        output.diagnostics?.some(
            (item) => item.category === ts.DiagnosticCategory.Error
        ) ?? false
    )
}

const diagnostic = (
    code: CompilerDiagnostic["code"],
    message: string
): CompilerDiagnostic => ({
    code,
    message,
    severity: "error",
})

const unchanged = (
    code: string,
    diagnostics: CompilerDiagnostic[]
): TransformResult => ({
    code,
    map: null,
    candidates: [],
    diagnostics,
    changed: false,
})
