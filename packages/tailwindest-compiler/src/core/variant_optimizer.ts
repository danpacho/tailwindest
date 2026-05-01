import type { CompilerDiagnostic } from "./diagnostic_types"
import {
    deepMerge,
    getClassName,
    type EvaluationEngineOptions,
} from "./evaluator"
import { candidatesFromClassName } from "./merger"
import type { StaticStyleObject } from "./static_value"

export interface OptimizeVariantsInput {
    base?: StaticStyleObject
    variants: Record<string, Record<string, StaticStyleObject>>
    variantTableLimit?: number
    variantResolver?: EvaluationEngineOptions["variantResolver"]
}

export interface OptimizedAdditiveAxis {
    axis: string
    classMap: Record<string, string>
    styleMap: Record<string, StaticStyleObject>
    baseFallbackStyle: StaticStyleObject
    baseFallbackClass: string
}

export interface OptimizedVariantComponent {
    axes: string[]
    classTable: Record<string, string>
    styleTable: Record<string, StaticStyleObject>
    axisClassMaps: Record<string, Record<string, string>>
    axisStyleMaps: Record<string, Record<string, StaticStyleObject>>
    axisBaseFallbackStyles: Record<string, StaticStyleObject>
    axisBaseFallbackClasses: Record<string, string>
}

export interface OptimizedVariants {
    strategy: "additive" | "component" | "mixed" | "fallback"
    exact: boolean
    additiveAxes: OptimizedAdditiveAxis[]
    components: OptimizedVariantComponent[]
    axisValueKeys: Record<string, string[]>
    classCandidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export function optimizeVariants({
    base = {},
    variants,
    variantTableLimit = 256,
    variantResolver,
}: OptimizeVariantsInput): OptimizedVariants {
    const evaluationOptions: EvaluationEngineOptions = { variantResolver }
    const axes = Object.keys(variants)
    const axisValueKeys = Object.fromEntries(
        axes.map((axis) => [axis, Object.keys(variants[axis] ?? {})])
    )
    const candidates = collectVariantCandidates(
        base,
        variants,
        evaluationOptions
    )
    const graph = buildConflictGraph(axes, variants)
    const groups = connectedComponents(axes, graph)
    const additiveAxes: OptimizedAdditiveAxis[] = []
    const components: OptimizedVariantComponent[] = []
    const diagnostics: CompilerDiagnostic[] = []

    for (const group of groups) {
        if (group.length === 1) {
            const axis = group[0]!
            additiveAxes.push(
                createAdditiveAxis(
                    axis,
                    variants[axis] ?? {},
                    base,
                    evaluationOptions
                )
            )
            continue
        }

        const count = optionalVariantStateCount(group, axisValueKeys)
        if (count > variantTableLimit) {
            diagnostics.push({
                code: "VARIANT_TABLE_LIMIT_EXCEEDED",
                message: `Variant component table for ${group.join(", ")} has ${count} entries, exceeding limit ${variantTableLimit}.`,
                severity: "warning",
            })
            return {
                strategy: "fallback",
                exact: false,
                additiveAxes: [],
                components: [],
                axisValueKeys,
                classCandidates: candidates,
                diagnostics,
            }
        }

        components.push(
            createComponent(group, variants, base, evaluationOptions)
        )
    }

    return {
        strategy:
            additiveAxes.length > 0 && components.length > 0
                ? "mixed"
                : components.length > 0
                  ? "component"
                  : "additive",
        exact: true,
        additiveAxes,
        components,
        axisValueKeys,
        classCandidates: candidates,
        diagnostics,
    }
}

export function styleWritePaths(style: StaticStyleObject): string[] {
    const paths: string[] = []
    collectWritePaths(style, [], paths)
    return paths
}

export function variantCombinationCount(
    axes: string[],
    axisValueKeys: Record<string, string[]>
): number {
    return axes.reduce(
        (total, axis) => total * (axisValueKeys[axis]?.length ?? 0),
        1
    )
}

export function optionalVariantStateCount(
    axes: string[],
    axisValueKeys: Record<string, string[]>
): number {
    return axes.reduce(
        (total, axis) => total * ((axisValueKeys[axis]?.length ?? 0) + 1),
        1
    )
}

export function variantKey(values: [string, string | undefined][]): string {
    return values
        .map(([axis, value]) =>
            value === undefined ? `${axis}:m` : `${axis}:v:${value}`
        )
        .join("|")
}

function createAdditiveAxis(
    axis: string,
    values: Record<string, StaticStyleObject>,
    base: StaticStyleObject,
    options: EvaluationEngineOptions
): OptimizedAdditiveAxis {
    const baseFallbackStyle = pickStylePaths(base, axisWritePaths(values))
    return {
        axis,
        classMap: Object.fromEntries(
            Object.entries(values).map(([key, style]) => [
                key,
                getClassName(style, options),
            ])
        ),
        styleMap: values,
        baseFallbackStyle,
        baseFallbackClass: getClassName(baseFallbackStyle, options),
    }
}

function createComponent(
    axes: string[],
    variants: Record<string, Record<string, StaticStyleObject>>,
    base: StaticStyleObject,
    options: EvaluationEngineOptions
): OptimizedVariantComponent {
    const entries = cartesian(
        axes.map((axis) =>
            [undefined, ...Object.keys(variants[axis] ?? {})].map(
                (value) => [axis, value] as [string, string | undefined]
            )
        )
    )
    const classTable: Record<string, string> = {}
    const styleTable: Record<string, StaticStyleObject> = {}
    const axisClassMaps: Record<string, Record<string, string>> = {}
    const axisStyleMaps: Record<string, Record<string, StaticStyleObject>> = {}
    const axisBaseFallbackStyles: Record<string, StaticStyleObject> = {}
    const axisBaseFallbackClasses: Record<string, string> = {}

    for (const axis of axes) {
        const axisStyles = variants[axis] ?? {}
        axisClassMaps[axis] = Object.fromEntries(
            Object.entries(axisStyles).map(([key, style]) => [
                key,
                getClassName(style, options),
            ])
        )
        axisStyleMaps[axis] = axisStyles
        axisBaseFallbackStyles[axis] = pickStylePaths(
            base,
            axisWritePaths(axisStyles)
        )
        axisBaseFallbackClasses[axis] = getClassName(
            axisBaseFallbackStyles[axis]!,
            options
        )
    }

    const componentBaseFallback = pickStylePaths(
        base,
        axes.flatMap((axis) => axisWritePaths(variants[axis] ?? {}))
    )

    for (const combination of entries) {
        const styles = [
            componentBaseFallback,
            ...combination.flatMap(([axis, value]) =>
                value === undefined ? [] : [variants[axis]?.[value] ?? {}]
            ),
        ]
        const style = deepMerge(styles)
        styleTable[variantKey(combination)] = style
        classTable[variantKey(combination)] = getClassName(style, options)
    }

    return {
        axes,
        classTable,
        styleTable,
        axisClassMaps,
        axisStyleMaps,
        axisBaseFallbackStyles,
        axisBaseFallbackClasses,
    }
}

function buildConflictGraph(
    axes: string[],
    variants: Record<string, Record<string, StaticStyleObject>>
): Map<string, Set<string>> {
    const graph = new Map(axes.map((axis) => [axis, new Set<string>()]))
    const writes = new Map(
        axes.map((axis) => [axis, axisWritePaths(variants[axis] ?? {})])
    )

    for (let leftIndex = 0; leftIndex < axes.length; leftIndex += 1) {
        for (
            let rightIndex = leftIndex + 1;
            rightIndex < axes.length;
            rightIndex += 1
        ) {
            const left = axes[leftIndex]!
            const right = axes[rightIndex]!
            if (
                !pathsOverlap(writes.get(left) ?? [], writes.get(right) ?? [])
            ) {
                continue
            }
            graph.get(left)?.add(right)
            graph.get(right)?.add(left)
        }
    }

    return graph
}

function connectedComponents(
    axes: string[],
    graph: Map<string, Set<string>>
): string[][] {
    const seen = new Set<string>()
    const groups: string[][] = []

    for (const axis of axes) {
        if (seen.has(axis)) continue
        const stack = [axis]
        const group: string[] = []
        seen.add(axis)
        while (stack.length > 0) {
            const current = stack.pop()!
            group.push(current)
            for (const next of graph.get(current) ?? []) {
                if (seen.has(next)) continue
                seen.add(next)
                stack.push(next)
            }
        }
        groups.push(
            group.sort(
                (left, right) => axes.indexOf(left) - axes.indexOf(right)
            )
        )
    }

    return groups
}

function collectWritePaths(
    value: unknown,
    path: string[],
    paths: string[]
): void {
    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value as Record<string, unknown>).length > 0
    ) {
        for (const [key, child] of Object.entries(
            value as Record<string, unknown>
        )) {
            collectWritePaths(child, [...path, key], paths)
        }
        return
    }

    if (path.length > 0) {
        paths.push(path.join("."))
    }
}

function axisWritePaths(values: Record<string, StaticStyleObject>): string[] {
    return unique(
        Object.values(values).flatMap((style) => styleWritePaths(style))
    )
}

function pathsOverlap(left: string[], right: string[]): boolean {
    return left.some((leftPath) =>
        right.some(
            (rightPath) =>
                leftPath === rightPath ||
                leftPath.startsWith(`${rightPath}.`) ||
                rightPath.startsWith(`${leftPath}.`)
        )
    )
}

function pickStylePaths(
    style: StaticStyleObject,
    paths: string[]
): StaticStyleObject {
    const picked: StaticStyleObject = {}
    for (const path of paths) {
        const value = getPath(style, path.split("."))
        if (value !== undefined) {
            setPath(picked, path.split("."), value)
        }
    }
    return picked
}

function getPath(value: unknown, path: string[]): unknown {
    let current = value
    for (const key of path) {
        if (!current || typeof current !== "object") return undefined
        current = (current as Record<string, unknown>)[key]
    }
    return current
}

function setPath(
    target: StaticStyleObject,
    path: string[],
    value: unknown
): void {
    let current: Record<string, unknown> = target
    for (let index = 0; index < path.length - 1; index += 1) {
        const key = path[index]!
        current[key] = (current[key] ?? {}) as Record<string, unknown>
        current = current[key] as Record<string, unknown>
    }
    current[path[path.length - 1]!] = value
}

function cartesian<T>(groups: T[][]): T[][] {
    return groups.reduce<T[][]>(
        (acc, group) =>
            acc.flatMap((prefix) => group.map((item) => [...prefix, item])),
        [[]]
    )
}

function collectVariantCandidates(
    base: StaticStyleObject,
    variants: Record<string, Record<string, StaticStyleObject>>,
    options: EvaluationEngineOptions
): string[] {
    return unique([
        ...candidatesFromClassName(getClassName(base, options)),
        ...Object.values(variants).flatMap((axis) =>
            Object.values(axis).flatMap((style) =>
                candidatesFromClassName(getClassName(style, options))
            )
        ),
    ])
}

function unique(values: string[]): string[] {
    return [...new Set(values)]
}
