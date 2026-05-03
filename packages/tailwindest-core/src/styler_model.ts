import {
    type AdditionalClassTokens,
    deepMerge,
    getClassName,
    type Merger,
    mergeClassNames,
} from "./style_engine"

export type StaticStyleObject = Record<string, unknown>
export type StaticVariantRecord = Record<
    string,
    Record<string, StaticStyleObject>
>

export interface PrimitiveStyleModel<StyleType = StaticStyleObject> {
    kind: "style"
    style: StyleType
}

export interface ToggleStyleModel<StyleType = StaticStyleObject> {
    kind: "toggle"
    base: StyleType
    truthy: StyleType
    falsy: StyleType
}

export interface RotaryStyleModel<StyleType = StaticStyleObject> {
    kind: "rotary"
    base: StyleType
    variants: Record<string, StyleType>
}

export interface VariantsStyleModel<StyleType = StaticStyleObject> {
    kind: "variants"
    base: StyleType
    variants: Record<string, Record<string, StyleType>>
}

export type StylerModel<StyleType = StaticStyleObject> =
    | PrimitiveStyleModel<StyleType>
    | ToggleStyleModel<StyleType>
    | RotaryStyleModel<StyleType>
    | VariantsStyleModel<StyleType>

export function createPrimitiveModel<StyleType>(
    style: StyleType
): PrimitiveStyleModel<StyleType> {
    return {
        kind: "style",
        style,
    }
}

export function createToggleModel<StyleType>(config: {
    base?: StyleType
    truthy: StyleType
    falsy: StyleType
}): ToggleStyleModel<StyleType> {
    return {
        kind: "toggle",
        base: config.base ?? ({} as StyleType),
        truthy: config.truthy,
        falsy: config.falsy,
    }
}

export function createRotaryModel<StyleType>(config: {
    base?: StyleType
    variants: Record<string, StyleType>
}): RotaryStyleModel<StyleType> {
    return {
        kind: "rotary",
        base: config.base ?? ({} as StyleType),
        variants: config.variants,
    }
}

export function createVariantsModel<StyleType>(config: {
    base?: StyleType
    variants: Record<string, Record<string, StyleType>>
}): VariantsStyleModel<StyleType> {
    return {
        kind: "variants",
        base: config.base ?? ({} as StyleType),
        variants: config.variants,
    }
}

export function primitiveClass<StyleType, StyleLiteral extends string = string>(
    model: PrimitiveStyleModel<StyleType>,
    extraClassList: AdditionalClassTokens<StyleLiteral> = [],
    merger?: Merger<StyleLiteral>
): string {
    const inquired = getClassName(model.style)
    if (extraClassList.length === 0) return inquired
    return mergeClassNames(merger, inquired as StyleLiteral, ...extraClassList)
}

export function primitiveStyle<StyleType>(
    model: PrimitiveStyleModel<StyleType>,
    extraStyles: Array<StyleType> = []
): StyleType {
    const inquired = model.style
    if (extraStyles.length === 0) return inquired
    return deepMerge(inquired, ...extraStyles)
}

export function composePrimitive<StyleType>(
    model: PrimitiveStyleModel<StyleType>,
    styles: Array<StyleType>
): PrimitiveStyleModel<StyleType> {
    return createPrimitiveModel(deepMerge(model.style, ...styles))
}

export function toggleStyleFor<StyleType>(
    model: ToggleStyleModel<StyleType>,
    condition: boolean,
    extraStyles: Array<StyleType> = []
): StyleType {
    const inquired = rotaryStyleFor(
        {
            kind: "rotary",
            base: model.base,
            variants: {
                T: model.truthy,
                F: model.falsy,
            },
        },
        condition ? "T" : "F"
    )
    return deepMerge(inquired, ...extraStyles)
}

export function toggleClassFor<StyleType, StyleLiteral extends string = string>(
    model: ToggleStyleModel<StyleType>,
    condition: boolean,
    extraClassList: AdditionalClassTokens<StyleLiteral> = [],
    merger?: Merger<StyleLiteral>
): string {
    const inquired = getClassName(toggleStyleFor(model, condition))
    if (extraClassList.length === 0) return inquired
    return mergeClassNames(merger, inquired as StyleLiteral, ...extraClassList)
}

export function composeToggle<StyleType>(
    model: ToggleStyleModel<StyleType>,
    styles: Array<StyleType>
): ToggleStyleModel<StyleType> {
    const mergedBase = deepMerge(model.base, ...styles)
    return createToggleModel({
        base: mergedBase,
        truthy: model.truthy,
        falsy: model.falsy,
    })
}

export function rotaryStyleFor<StyleType>(
    model: RotaryStyleModel<StyleType>,
    key?: string,
    extraStyles: Array<StyleType> = []
): StyleType {
    const selected =
        key === "base" ? model.base : (model.variants[key ?? ""] as StyleType)
    const inquired =
        key === "base" || selected === undefined
            ? selected
            : deepMerge(model.base, selected)
    return deepMerge(inquired, ...extraStyles)
}

export function rotaryClassFor<StyleType, StyleLiteral extends string = string>(
    model: RotaryStyleModel<StyleType>,
    key: string,
    extraClassList: AdditionalClassTokens<StyleLiteral> = [],
    merger?: Merger<StyleLiteral>
): string {
    const style =
        key === "base" ? model.base : deepMerge(model.base, model.variants[key])
    const inquired = getClassName(style)
    return mergeClassNames(merger, inquired as StyleLiteral, ...extraClassList)
}

export function composeRotary<StyleType>(
    model: RotaryStyleModel<StyleType>,
    styles: Array<StyleType>
): RotaryStyleModel<StyleType> {
    const baseStyle = rotaryStyleFor(model, "base")
    const composedStyle = deepMerge(baseStyle, ...styles)
    return createRotaryModel({
        base: composedStyle,
        variants: model.variants,
    })
}

export function variantsStyleFor<StyleType>(
    model: VariantsStyleModel<StyleType>,
    props: Record<string, unknown>,
    extraStyles: Array<StyleType> = []
): StyleType {
    let merged = model.base

    for (const [variantKey, subVariant] of Object.entries(props)) {
        if (subVariant) {
            const variantRecord = model.variants[variantKey]
            if (!variantRecord) continue
            const subStyle = rotaryStyleFor(
                {
                    kind: "rotary",
                    base: {} as StyleType,
                    variants: variantRecord,
                },
                String(subVariant)
            )
            merged = deepMerge(merged, subStyle)
        }
    }

    if (extraStyles.length === 0) return merged
    return deepMerge(merged, ...extraStyles)
}

export function variantsClassFor<
    StyleType,
    StyleLiteral extends string = string,
>(
    model: VariantsStyleModel<StyleType>,
    props: Record<string, unknown>,
    extraClassList: AdditionalClassTokens<StyleLiteral> = [],
    merger?: Merger<StyleLiteral>
): string {
    const className = getClassName(variantsStyleFor(model, props))
    if (extraClassList.length === 0) return className
    return mergeClassNames(merger, className as StyleLiteral, ...extraClassList)
}

export function composeVariants<StyleType>(
    model: VariantsStyleModel<StyleType>,
    styles: Array<StyleType>
): VariantsStyleModel<StyleType> {
    const mergedBase = deepMerge(model.base, ...styles)
    return createVariantsModel({
        base: mergedBase,
        variants: model.variants,
    })
}
