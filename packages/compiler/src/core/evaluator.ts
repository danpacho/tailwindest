import type { StaticClassValue, StaticStyleObject } from "./static_value"
import {
    applyMergerPolicy,
    candidatesFromClassName,
    type EvaluationOptions,
    type EvaluationResult,
    type MergerPolicy,
} from "./merger"

type NestedRecord = Record<string, unknown>

export interface EvaluationEngine {
    flattenRecord(style: StaticStyleObject | null | undefined): string[]
    getClassName(style: StaticStyleObject | null | undefined): string
    deepMerge(styles: StaticStyleObject[]): StaticStyleObject
    join(
        values: StaticClassValue[],
        merger: MergerPolicy,
        options?: EvaluationOptions
    ): EvaluationResult<string>
    def(
        classList: StaticClassValue[],
        styles: StaticStyleObject[],
        merger: MergerPolicy,
        options?: EvaluationOptions
    ): EvaluationResult<string>
    mergeProps(
        styles: StaticStyleObject[],
        merger: MergerPolicy,
        options?: EvaluationOptions
    ): EvaluationResult<string>
    mergeRecord(
        styles: StaticStyleObject[]
    ): EvaluationResult<StaticStyleObject>
}

export function flattenRecord(
    style: StaticStyleObject | null | undefined
): string[] {
    return Object.values(style ?? {})
        .map((value) =>
            typeof value !== "string"
                ? flattenRecord(value as StaticStyleObject)
                : value
        )
        .flat()
}

export function deepMerge(styles: StaticStyleObject[]): StaticStyleObject {
    return styles.reduce<NestedRecord>((mergedObject, currentObject) => {
        if (!currentObject) return mergedObject

        for (const [key, value] of Object.entries(currentObject)) {
            if (mergedObject[key] === undefined) {
                mergedObject[key] = value
            } else {
                const existing = mergedObject[key]
                if (Array.isArray(value)) {
                    mergedObject[key] = value
                } else if (
                    typeof existing === "object" &&
                    existing !== null &&
                    typeof value === "object" &&
                    value !== null
                ) {
                    mergedObject[key] = deepMerge([
                        existing as StaticStyleObject,
                        value as StaticStyleObject,
                    ])
                } else {
                    mergedObject[key] = value
                }
            }
        }

        return mergedObject
    }, {}) as StaticStyleObject
}

export function getClassName(
    style: StaticStyleObject | null | undefined
): string {
    return flattenRecord(style).join(" ")
}

export function createEvaluationEngine(): EvaluationEngine {
    return {
        flattenRecord,
        getClassName,
        deepMerge,
        join,
        def,
        mergeProps,
        mergeRecord,
    }
}

export function join(
    values: StaticClassValue[],
    merger: MergerPolicy,
    options?: EvaluationOptions
): EvaluationResult<string> {
    return applyMergerPolicy(toClass(values), merger, options)
}

export function def(
    classList: StaticClassValue[],
    styles: StaticStyleObject[],
    merger: MergerPolicy,
    options?: EvaluationOptions
): EvaluationResult<string> {
    const styleClassName = getClassName(deepMerge(styles))
    return join([...classList, styleClassName], merger, options)
}

export function mergeProps(
    styles: StaticStyleObject[],
    merger: MergerPolicy,
    options?: EvaluationOptions
): EvaluationResult<string> {
    return applyMergerPolicy(getClassName(deepMerge(styles)), merger, options)
}

export function mergeRecord(
    styles: StaticStyleObject[]
): EvaluationResult<StaticStyleObject> {
    const value = deepMerge(styles)

    return {
        value,
        candidates: candidatesFromClassName(getClassName(value)),
        diagnostics: [],
        exact: true,
    }
}

function toClass(values: StaticClassValue[]): string {
    const classes: string[] = []

    for (const value of values) {
        const className = toClassValue(value)
        if (className.length > 0) {
            classes.push(className)
        }
    }

    return classes.join(" ")
}

function toClassValue(value: StaticClassValue): string {
    if (!value) return ""

    if (typeof value === "string" || typeof value === "number") {
        return String(value)
    }

    if (Array.isArray(value)) {
        return toClass(value)
    }

    if (typeof value === "object") {
        const classes: string[] = []
        for (const key in value) {
            if (value[key]) {
                classes.push(key)
            }
        }
        return classes.join(" ")
    }

    return ""
}
