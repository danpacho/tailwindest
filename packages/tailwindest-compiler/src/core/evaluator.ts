import {
    deepMerge as coreDeepMerge,
    toClass as coreToClass,
} from "@tailwindest/core"
import {
    flattenCompiledStyleRecord,
    type CompiledStyleNormalizationOptions,
} from "./compiled_style_normalizer"
import type { StaticClassValue, StaticStyleObject } from "./static_value"
import {
    applyMergerPolicy,
    candidatesFromClassName,
    type EvaluationResult,
    type MergerPolicy,
} from "./merger"

/**
 * Deterministic evaluator used by the compiler to flatten Tailwindest style
 * objects and class lists at build time.
 *
 * @public
 */
export interface EvaluationEngine {
    flattenRecord(style: StaticStyleObject | null | undefined): string[]
    getClassName(style: StaticStyleObject | null | undefined): string
    deepMerge(styles: StaticStyleObject[]): StaticStyleObject
    join(
        values: StaticClassValue[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    def(
        classList: StaticClassValue[],
        styles: StaticStyleObject[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    mergeProps(
        styles: StaticStyleObject[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    mergeRecord(
        styles: StaticStyleObject[]
    ): EvaluationResult<StaticStyleObject>
}

export type EvaluationEngineOptions = CompiledStyleNormalizationOptions

/**
 * Flatten every string leaf in a Tailwindest style object.
 *
 * @public
 */
export function flattenRecord(
    style: StaticStyleObject | null | undefined,
    options: EvaluationEngineOptions = {}
): string[] {
    return flattenCompiledStyleRecord(style, options)
}

/**
 * Deep-merge style objects using Tailwindest's build-time overwrite rules.
 *
 * @public
 */
export function deepMerge(styles: StaticStyleObject[]): StaticStyleObject {
    return coreDeepMerge(...styles)
}

/**
 * Convert a style object into a whitespace-separated Tailwind class string.
 *
 * @public
 */
export function getClassName(
    style: StaticStyleObject | null | undefined,
    options: EvaluationEngineOptions = {}
): string {
    return flattenRecord(style, options).join(" ")
}

/**
 * Create a deterministic evaluator instance.
 *
 * @public
 */
export function createEvaluationEngine(
    options: EvaluationEngineOptions = {}
): EvaluationEngine {
    return {
        flattenRecord: (style) => flattenRecord(style, options),
        getClassName: (style) => getClassName(style, options),
        deepMerge,
        join: (values, merger) => join(values, merger),
        def: (classList, styles, merger) =>
            def(classList, styles, merger, options),
        mergeProps: (styles, merger) => mergeProps(styles, merger, options),
        mergeRecord: (styles) => mergeRecord(styles, options),
    }
}

export function join(
    values: StaticClassValue[],
    merger: MergerPolicy
): EvaluationResult<string> {
    return applyMergerPolicy(toClass(values), merger)
}

export function def(
    classList: StaticClassValue[],
    styles: StaticStyleObject[],
    merger: MergerPolicy,
    options: EvaluationEngineOptions = {}
): EvaluationResult<string> {
    const styleClassName = getClassName(deepMerge(styles), options)
    return join([...classList, styleClassName], merger)
}

export function mergeProps(
    styles: StaticStyleObject[],
    merger: MergerPolicy,
    options: EvaluationEngineOptions = {}
): EvaluationResult<string> {
    return applyMergerPolicy(getClassName(deepMerge(styles), options), merger)
}

export function mergeRecord(
    styles: StaticStyleObject[],
    options: EvaluationEngineOptions = {}
): EvaluationResult<StaticStyleObject> {
    const value = deepMerge(styles)

    return {
        value,
        candidates: candidatesFromClassName(getClassName(value, options)),
        diagnostics: [],
        exact: true,
    }
}

export function toClass(values: StaticClassValue[]): string {
    return coreToClass(...values)
}
