import { deepMerge, getClassName } from "./evaluator"
import { candidatesFromClassName, defaultMerge } from "./merger"
import type { StaticClassValue, StaticStyleObject } from "./static_value"

export type StaticVariantRecord = Record<
    string,
    Record<string, StaticStyleObject>
>

export interface PrimitiveStyleModel {
    kind: "style"
    style: StaticStyleObject
}

export interface ToggleStyleModel {
    kind: "toggle"
    base: StaticStyleObject
    truthy: StaticStyleObject
    falsy: StaticStyleObject
}

export interface RotaryStyleModel {
    kind: "rotary"
    base: StaticStyleObject
    variants: Record<string, StaticStyleObject>
}

export interface VariantsStyleModel {
    kind: "variants"
    base: StaticStyleObject
    variants: StaticVariantRecord
}

export type StylerModel =
    | PrimitiveStyleModel
    | ToggleStyleModel
    | RotaryStyleModel
    | VariantsStyleModel

export function createPrimitiveModel(
    style: StaticStyleObject
): PrimitiveStyleModel {
    return {
        kind: "style",
        style,
    }
}

export function createToggleModel(config: {
    base?: StaticStyleObject
    truthy: StaticStyleObject
    falsy: StaticStyleObject
}): ToggleStyleModel {
    return {
        kind: "toggle",
        base: config.base ?? {},
        truthy: config.truthy,
        falsy: config.falsy,
    }
}

export function createRotaryModel(config: {
    base?: StaticStyleObject
    variants: Record<string, StaticStyleObject>
}): RotaryStyleModel {
    return {
        kind: "rotary",
        base: config.base ?? {},
        variants: config.variants,
    }
}

export function createVariantsModel(config: {
    base?: StaticStyleObject
    variants: StaticVariantRecord
}): VariantsStyleModel {
    return {
        kind: "variants",
        base: config.base ?? {},
        variants: config.variants,
    }
}

export function primitiveClass(
    model: PrimitiveStyleModel,
    extraClass: unknown[] = []
): string {
    return mergeClassNames(getClassName(model.style), ...extraClass)
}

export function primitiveStyle(
    model: PrimitiveStyleModel,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return deepMerge([model.style, ...extraStyles])
}

export function composePrimitive(
    model: PrimitiveStyleModel,
    styles: StaticStyleObject[]
): PrimitiveStyleModel {
    return createPrimitiveModel(deepMerge([model.style, ...styles]))
}

export function toggleStyleFor(
    model: ToggleStyleModel,
    condition: boolean,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    return deepMerge([
        model.base,
        condition ? model.truthy : model.falsy,
        ...extraStyles,
    ])
}

export function toggleClassFor(
    model: ToggleStyleModel,
    condition: boolean,
    extraClass: unknown[] = []
): string {
    return mergeClassNames(
        getClassName(toggleStyleFor(model, condition)),
        ...extraClass
    )
}

export function composeToggle(
    model: ToggleStyleModel,
    styles: StaticStyleObject[]
): ToggleStyleModel {
    return {
        ...model,
        base: deepMerge([model.base, ...styles]),
    }
}

export function rotaryStyleFor(
    model: RotaryStyleModel,
    key: string,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    const selected = key === "base" ? {} : (model.variants[key] ?? {})
    return deepMerge([model.base, selected, ...extraStyles])
}

export function rotaryClassFor(
    model: RotaryStyleModel,
    key: string,
    extraClass: unknown[] = []
): string {
    return mergeClassNames(
        getClassName(rotaryStyleFor(model, key)),
        ...extraClass
    )
}

export function composeRotary(
    model: RotaryStyleModel,
    styles: StaticStyleObject[]
): RotaryStyleModel {
    return {
        ...model,
        base: deepMerge([model.base, ...styles]),
    }
}

export function variantsStyleFor(
    model: VariantsStyleModel,
    props: Record<string, unknown>,
    extraStyles: StaticStyleObject[] = []
): StaticStyleObject {
    const styles: StaticStyleObject[] = [model.base]
    for (const [axis, value] of Object.entries(props)) {
        if (!value) continue
        const axisRecord = model.variants[axis]
        if (!axisRecord) continue
        const style = axisRecord[String(value)]
        if (style) styles.push(style)
    }
    return deepMerge([...styles, ...extraStyles])
}

export function variantsClassFor(
    model: VariantsStyleModel,
    props: Record<string, unknown>,
    extraClass: unknown[] = []
): string {
    return mergeClassNames(
        getClassName(variantsStyleFor(model, props)),
        ...extraClass
    )
}

export function composeVariants(
    model: VariantsStyleModel,
    styles: StaticStyleObject[]
): VariantsStyleModel {
    return {
        ...model,
        base: deepMerge([model.base, ...styles]),
    }
}

export function classCandidatesFromStyles(
    styles: StaticStyleObject[]
): string[] {
    const candidates: string[] = []
    for (const style of styles) {
        candidates.push(...candidatesFromClassName(getClassName(style)))
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
    return defaultMerge([
        base,
        ...extraClass.flatMap((item) => normalizeClassToken(item)),
    ])
}

function normalizeClassToken(value: unknown): string[] {
    if (!value) return []
    if (typeof value === "string" || typeof value === "number") {
        return [String(value)]
    }
    if (Array.isArray(value)) {
        return value.flatMap((item) => normalizeClassToken(item))
    }
    return []
}

export function toClass(values: StaticClassValue[]): string {
    const classes: string[] = []
    for (const value of values) {
        const className = toClassValue(value)
        if (className.length > 0) classes.push(className)
    }
    return classes.join(" ")
}

function toClassValue(value: StaticClassValue): string {
    if (!value) return ""
    if (typeof value === "string" || typeof value === "number")
        return String(value)
    if (Array.isArray(value)) return toClass(value)
    if (typeof value === "object") {
        const classes: string[] = []
        for (const key in value) {
            if (value[key]) classes.push(key)
        }
        return classes.join(" ")
    }
    return ""
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
