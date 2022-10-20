import type { TailwindWithOption } from "./types/tailwind.plugin"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind.plugin.option"
import type { TailwindestTypeSet } from "./types/tailwindest"
import { TailwindestNest } from "./types/tailwindest/@nest.basic"
import { cache, deepMerge, getCachedValue, getTailwindClass } from "./utils"

/**
 * @note add custome property at `tailwind.config.js`
 * @note `CASE1`: define custom style type
 * @example
 * type MyTailwindest = Tailwindest<{
 * //       ✅ Add color, opacity, spacing global type
 *          color: "my-color1" | "my-color2",
 *          opacity: "12.5"
 *          spacing: "0.25" | "0.5" | "0.75",
 *      },
 *      {
 * //       ✅ Add "my-flex", "my-shadow1" & "my-shadow2"
 *          display: "my-flex",
 *          shadow: "my-shadow1" | "my-shadow2"
 *      }
 * >
 * @note `CASE2`: pick specific type
 * @example
 * // ✅ Get all type of MyTailwindest fontSize
 * type FontSize = MyTailwindest["fontSize"]
 */
export type Tailwindest<
    TailwindCustom extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    CustomExtends extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = Partial<
    TailwindestTypeSet<TailwindWithOption<TailwindCustom, CustomExtends>>
>

/**
 * @note extend screen type, should be one screen key
 * @example
 * type MyMid = TailwindestScreens<MyTailwindest, "@my-mid">
 * // ✅ @my-md screen type
 */
export type TailwindestScreens<
    Tailwind,
    OnlyOneScreenKey extends string
> = TailwindestNest<Tailwind, OnlyOneScreenKey>

type StringKey<Key> = Extract<Key, string>
type VariantsStyles<Key extends string, T> = Record<Key, T>

/** @note base cache key for `style` and `class` */
const BASE_KEY = Symbol()

type WindVariant<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
> = ReturnType<typeof windCore<StyleType, VariantsStylesType>>

type Wind<StyleType> = ReturnType<typeof windCore<StyleType>>

/**
 * @param style style object
 * @param variantsStyles **optional** variants style objects
 * @note variant is key of `variantsStyles`
 * @returns `class` tailwind class extractor `function`
 * @returns `style` input style extractor `function`, use it to compose styles
 * @returns `compose` style set
 */
function windCore<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(
    style: StyleType,
    variantsStyles: VariantsStylesType
): {
    /**
     * @note class extractor `function`
     * @example
     * // ✅ define box with "container" | "input" variants
     * const box = wind$("container", "input")({ ...baseStyle })
     *
     * // ✅ get container variant class string
     * const container = box.class("container")
     *
     * // ✅ get baseStyle class string
     * const boxBase = box.class()
     */
    class: (variant?: StringKey<keyof VariantsStylesType>) => string
    /**
     * @note input style extractor `function`, use it to compose styles
     * @example
     * // ✅ get "box" variant style object
     * const boxStyle = wind$("box")({ ...baseStyle }).style("box")
     */
    style: (variant?: StringKey<keyof VariantsStylesType>) => StyleType
    /**
     * @note `compose` multiple styles to one object
     * @example
     * // ✅ get composed result of baseStyle & border.style()
     * const boxBorder = wind$("box")({ ...baseStyle }).compose(border.style())
     */
    compose: (
        ...styles: StyleType[]
    ) => WindVariant<StyleType, VariantsStylesType>
}
function windCore<StyleType>(style: StyleType): {
    /**
     * @note class extractor `function`
     * @example
     * // ✅ define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ get btn class string
     * const buttonClass = button.class()
     */
    class: () => string
    /**
     * @note input style extractor `function`, use it to compose styles
     * @example
     * // ✅ define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ get button style object
     * const butonStyle = button.style()
     */
    style: () => StyleType
    /**
     * @note `compose` multiple styles to one object
     * @example
     * // ✅ get composed result of btnStyle & border.style()
     * const buttonWithBorder = wind({ ...btnStyle }).compose(border.style())
     */
    compose: (...styles: StyleType[]) => Wind<StyleType>
}
function windCore<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(style: StyleType, variantsStyles?: VariantsStylesType) {
    const classStore = cache<string>()
    const styleStore = cache<StyleType>()

    classStore.set(BASE_KEY, getTailwindClass(style))

    return {
        class: (variant?: StringKey<keyof VariantsStylesType>) => {
            const cachedBaseStyle = getCachedValue<StyleType>(
                styleStore,
                BASE_KEY,
                () => style
            )
            const cachedBaseClass = getCachedValue<string>(
                classStore,
                BASE_KEY,
                () => getTailwindClass(cachedBaseStyle)
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseClass

            const cachedVariantStyle = getCachedValue<StyleType>(
                styleStore,
                variant,
                () =>
                    deepMerge(
                        cachedBaseStyle,
                        variantsStyles[variant] as StyleType
                    )
            )
            const cachedVariantClass = getCachedValue<string>(
                classStore,
                variant,
                () => getTailwindClass(cachedVariantStyle)
            )

            return cachedVariantClass
        },

        style: (variant?: StringKey<keyof VariantsStylesType>): StyleType => {
            const cachedBaseStyle = getCachedValue<StyleType>(
                styleStore,
                BASE_KEY,
                () => style
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseStyle

            const cachedVariantStyle = getCachedValue<StyleType>(
                styleStore,
                variant,
                () =>
                    deepMerge(
                        cachedBaseStyle,
                        variantsStyles[variant] as StyleType
                    )
            )
            return cachedVariantStyle
        },

        compose: function (
            ...styles: StyleType[]
        ): WindVariant<StyleType, VariantsStylesType> {
            const cachedBaseStyle = getCachedValue<StyleType>(
                styleStore,
                BASE_KEY,
                () => style
            )

            const composedStyle = styles.reduce<StyleType>(
                (composedStyle, currStyle) =>
                    deepMerge(composedStyle, currStyle),
                cachedBaseStyle
            )
            const composedClass = getTailwindClass(composedStyle)

            classStore.set(BASE_KEY, composedClass)
            styleStore.set(BASE_KEY, composedStyle)

            return this
        },
    }
}

/**
 * @note create `wind` functions with custom `style` type
 * @returns `wind` - just wind function
 * @example
 * // ✅ Add "my-color1" | "my-color2"
 * type MyTailwindest = Tailwindest<{
 *     color: "my-color1" | "my-color2",
 * }>
 * // ✅ Adapt type with generic
 * const { wind: styled, wind$: styled$ } = createWind<MyTailwindest>()
 */
function createWind<StyleType>(): {
    wind$: <Variant extends string>(
        ...variants: Variant[]
    ) => typeof windCore<StyleType, VariantsStyles<Variant, StyleType>>
    wind: typeof windCore<StyleType>
}
function createWind() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const wind$ = (...variantsNames: string[]) => windCore
    return {
        wind$,
        wind: windCore,
    }
}

const defaultWind = createWind<Tailwindest>()
/**
 * @param style style object
 * @returns `class` tailwind class extractor `function`
 * @returns `style` input style extractor `function`, use it to compose styles
 */
const wind: (style: Tailwindest) => Wind<Tailwindest> = defaultWind.wind

/**
 * @param ...variants tailwind variant names
 * @returns `wind$(...variants)` tailwind style generator like `wind`
 */
const wind$: <Variant extends string>(
    ...variants: Variant[]
) => (
    baseStyle: Tailwindest,
    variantsStyles: VariantsStyles<Variant, Tailwindest>
) => WindVariant<Tailwindest, VariantsStyles<Variant, Tailwindest>> =
    defaultWind.wind$

/**
 * @note get variants `union` type of `wind` style,
 * @returns `string union` or `never`
 * @example
 * type BtnWithSuccessFail = WindVariants<typeof success_fail_btn>
 * // ✅ "success" | "fail"
 * type BtnWithNoVariants = WindVariants<typeof no_variants_btn>
 * // ❌ never
 */
export type WindVariants<WindStyle> = WindStyle extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? Variants
        : never
    : WindStyle extends (variants: infer Variants) => unknown
    ? Exclude<Variants, undefined>
    : never

export { createWind, wind, wind$ }
