import {
    composePrimitive as coreComposePrimitive,
    composeRotary as coreComposeRotary,
    composeToggle as coreComposeToggle,
    composeVariants as coreComposeVariants,
    createPrimitiveModel as coreCreatePrimitiveModel,
    createRotaryModel as coreCreateRotaryModel,
    createToggleModel as coreCreateToggleModel,
    createVariantsModel as coreCreateVariantsModel,
    primitiveStyle as corePrimitiveStyle,
    rotaryStyleFor as coreRotaryStyleFor,
    toClass as coreToClass,
    toggleStyleFor as coreToggleStyleFor,
    variantsStyleFor as coreVariantsStyleFor,
    type PrimitiveStyleModel as CorePrimitiveStyleModel,
    type RotaryStyleModel as CoreRotaryStyleModel,
    type ToggleStyleModel as CoreToggleStyleModel,
    type VariantsStyleModel as CoreVariantsStyleModel,
} from "@tailwindest/core"
import { getClassName, type EvaluationEngineOptions } from "./evaluator"
import { candidatesFromClassName } from "./merger"
import type { StaticClassValue, StaticStyleObject } from "./static_value"

export type StaticVariantRecord = Record<
    string,
    Record<string, StaticStyleObject>
>

export type PrimitiveStyleModel = CorePrimitiveStyleModel<StaticStyleObject>
export type ToggleStyleModel = CoreToggleStyleModel<StaticStyleObject>
export type RotaryStyleModel = CoreRotaryStyleModel<StaticStyleObject>
export type VariantsStyleModel = CoreVariantsStyleModel<StaticStyleObject>

export type StylerModel =
    | PrimitiveStyleModel
    | ToggleStyleModel
    | RotaryStyleModel
    | VariantsStyleModel

export function createPrimitiveModel(
    style: StaticStyleObject
): PrimitiveStyleModel {
    return coreCreatePrimitiveModel(style)
}

export function createToggleModel(config: {
    base?: StaticStyleObject
    truthy: StaticStyleObject
    falsy: StaticStyleObject
}): ToggleStyleModel {
    return coreCreateToggleModel(config)
}

export function createRotaryModel(config: {
    base?: StaticStyleObject
    variants: Record<string, StaticStyleObject>
}): RotaryStyleModel {
    return coreCreateRotaryModel(config)
}

export function createVariantsModel(config: {
    base?: StaticStyleObject
    variants: StaticVariantRecord
}): VariantsStyleModel {
    return coreCreateVariantsModel(config)
}

export function primitiveClass(
    model: PrimitiveStyleModel,
    extraClass: unknown[] = [],
    options: EvaluationEngineOptions = {}
): string {
    return mergeClassNames(getClassName(model.style, options), ...extraClass)
}

export function primitiveStyle(
    model: PrimitiveStyleModel,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return corePrimitiveStyle(model, extraStyles)
}

export function composePrimitive(
    model: PrimitiveStyleModel,
    styles: StaticStyleObject[]
): PrimitiveStyleModel {
    return coreComposePrimitive(model, styles)
}

export function toggleStyleFor(
    model: ToggleStyleModel,
    condition: boolean,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return coreToggleStyleFor(model, condition, extraStyles)
}

export function toggleClassFor(
    model: ToggleStyleModel,
    condition: boolean,
    extraClass: unknown[] = [],
    options: EvaluationEngineOptions = {}
): string {
    return mergeClassNames(
        getClassName(toggleStyleFor(model, condition), options),
        ...extraClass
    )
}

export function composeToggle(
    model: ToggleStyleModel,
    styles: StaticStyleObject[]
): ToggleStyleModel {
    return coreComposeToggle(model, styles)
}

export function rotaryStyleFor(
    model: RotaryStyleModel,
    key: string,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return coreRotaryStyleFor(model, key, extraStyles)
}

export function rotaryClassFor(
    model: RotaryStyleModel,
    key: string,
    extraClass: unknown[] = [],
    options: EvaluationEngineOptions = {}
): string {
    return mergeClassNames(
        getClassName(rotaryStyleFor(model, key), options),
        ...extraClass
    )
}

export function composeRotary(
    model: RotaryStyleModel,
    styles: StaticStyleObject[]
): RotaryStyleModel {
    return coreComposeRotary(model, styles)
}

export function variantsStyleFor(
    model: VariantsStyleModel,
    props: Record<string, unknown>,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return coreVariantsStyleFor(model, props, extraStyles)
}

export function variantsClassFor(
    model: VariantsStyleModel,
    props: Record<string, unknown>,
    extraClass: unknown[] = [],
    options: EvaluationEngineOptions = {}
): string {
    return mergeClassNames(
        getClassName(variantsStyleFor(model, props), options),
        ...extraClass
    )
}

export function composeVariants(
    model: VariantsStyleModel,
    styles: StaticStyleObject[]
): VariantsStyleModel {
    return coreComposeVariants(model, styles)
}

export function classCandidatesFromStyles(
    styles: StaticStyleObject[],
    options: EvaluationEngineOptions = {}
): string[] {
    const candidates: string[] = []
    for (const style of styles) {
        candidates.push(
            ...candidatesFromClassName(getClassName(style, options))
        )
    }
    return unique(candidates)
}

export function classCandidatesFromStrings(classNames: string[]): string[] {
    return unique(
        classNames.flatMap((className) => candidatesFromClassName(className))
    )
}

export function allVariantStyles(
    model: VariantsStyleModel
): StaticStyleObject[] {
    return [
        model.base,
        ...Object.values(model.variants).flatMap((axis) => Object.values(axis)),
    ]
}

export function allRotaryStyles(model: RotaryStyleModel): StaticStyleObject[] {
    return [model.base, ...Object.values(model.variants)]
}

export function allToggleStyles(model: ToggleStyleModel): StaticStyleObject[] {
    return [model.base, model.truthy, model.falsy]
}

export function mergeClassNames(
    base: string,
    ...extraClass: unknown[]
): string {
    return coreToClass(base, ...(extraClass as StaticClassValue[]))
}

export function toClass(values: StaticClassValue[]): string {
    return coreToClass(...values)
}

function unique(values: string[]): string[] {
    const seen = new Set<string>()
    const result: string[] = []
    for (const value of values) {
        if (seen.has(value)) continue
        seen.add(value)
        result.push(value)
    }
    return result
}
