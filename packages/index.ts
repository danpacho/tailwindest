import type { TailwindestNestKey } from "./types/plugin.nest"
import type { TailwindWithOption } from "./types/tailwind.plugin"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind.plugin.option"
import type { TailwindestTypeSet } from "./types/tailwindest"
import { cache, deepMerge, getCachedValue, getTailwindClass } from "./utils"

/**
 * @note Add custome property at `tailwind.config.js`
 * @docs [tailwind-configuration](https://tailwindcss.com/docs/configuration)
 * @note `Case1` Define custom style type
 * @example
 * type MyTailwindest = Tailwindest<{
 *          // ✅ Add color, opacity, spacing, screens global type
 *          color: "my-color1" | "my-color2",
 *          opacity: "12.5"
 *          spacing: "0.25" | "0.5" | "0.75",
 *          screens: {
 *              // ✅ only one string union
 *              conditionA: "@do-this",
 *              // ❌ more than one string union
 *              conditionB: "@dont-do-this" | "@dont-do-this-plz"
 *          }
 *      }
 *      {
 *          // ✅ Add "my-flex", "my-shadow1" & "my-shadow2"
 *          display: "my-flex",
 *          shadow: "my-shadow1" | "my-shadow2"
 *      }
 * >
 * @note `Case2` Pick specific type
 * @example
 * // ✅ Get MyTailwindest's fontSize
 * type FontSize = MyTailwindest["fontSize"]
 */
export type Tailwindest<
    TailwindCustom extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    CustomExtends extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = TailwindCustom["screens"] extends Record<string, unknown>
    ? Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
              TailwindestNestKey<TailwindCustom["screens"]>,
              TailwindCustom["screens"]
          >
      >
    : Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
              TailwindestNestKey
          >
      >

type ToString<MightBeString> = Extract<MightBeString, string>
type VariantsStyles<Variant extends string, StyleType> = Record<
    Variant,
    StyleType
>

/** @note base cache key for `style` and `class` */
const BASE_KEY = Symbol()

/**
 * @param style style object
 * @param variantsStyles optional variants style objects
 */
function windCore<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(
    style: StyleType,
    variantsStyles: VariantsStylesType
): {
    /**
     * @note Class extractor `function`
     * @example
     * // ✅ Define box with "container" | "input" variants
     * const box = wind$("container", "input")({ ...baseStyle })
     *
     * // ✅ Get container variant class string
     * const container = box.class("container")
     *
     * // ✅ Get baseStyle class string
     * const boxBase = box.class()
     */
    class: (variant?: ToString<keyof VariantsStylesType>) => string
    /**
     * @note Input style extractor `function`, use it to compose styles
     * @example
     * // ✅ Get "box" variant style object
     * const boxStyle = wind$("box")({ ...baseStyle }).style("box")
     */
    style: (variant?: ToString<keyof VariantsStylesType>) => StyleType
    /**
     * @note Compose multiple styles into one object
     * @example
     * // ✅ Get composed result of baseStyle & flexStyle & borderStyle
     * const box = wind$("active", "disabled")(
     *      { ...baseStyle },
     *      {
     *          active: {},
     *          disabled: {},
     *      }
     * ).compose(flexStyle, borderStyle)
     */
    compose: (...styles: StyleType[]) => {
        class: (variant?: ToString<keyof VariantsStylesType>) => string
        style: (variant?: ToString<keyof VariantsStylesType>) => StyleType
    }
}
function windCore<StyleType>(style: StyleType): {
    /**
     * @note Class extractor `function`
     * @example
     * // ✅ Define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ Get btn class string
     * const buttonClass = button.class()
     */
    class: () => string
    /**
     * @note Input style extractor `function`, use it to compose styles
     * @example
     * // ✅ Define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ Get button style object
     * const butonStyle = button.style()
     */
    style: () => StyleType
    /**
     * @note Compose multiple styles into one object
     * @example
     * // ✅ Get composed result of btnStyle & borderStyle
     * const buttonWithBorder = wind(
     *      { ...btnStyle },
     * ).compose(borderStyle)
     */
    compose: (...styles: StyleType[]) => {
        class: () => string
        style: () => StyleType
    }
}
function windCore<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(style: StyleType, variantsStyles?: VariantsStylesType) {
    const classStore = cache<string>()
    const styleStore = cache<StyleType>()

    classStore.set(BASE_KEY, getTailwindClass(style))

    return {
        class: (variant?: ToString<keyof VariantsStylesType>) => {
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

        style: (variant?: ToString<keyof VariantsStylesType>): StyleType => {
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

        compose: function (...styles: StyleType[]) {
            const cachedBaseStyle = getCachedValue<StyleType>(
                styleStore,
                BASE_KEY,
                () => style
            )

            const composedStyle = styles.reduce<StyleType>(
                (accStyle, currStyle) => deepMerge(accStyle, currStyle),
                cachedBaseStyle
            )
            const composedClass = getTailwindClass(composedStyle)

            classStore.set(BASE_KEY, composedClass)
            styleStore.set(BASE_KEY, composedStyle)

            return {
                class: this.class,
                style: this.style,
            }
        },
    }
}

/**
 * @note Create `wind` with custom `style` type
 * @example
 * // ✅ Add "my-color1" | "my-color2"
 * type MyTailwindest = Tailwindest<{
 *     color: "my-color1" | "my-color2",
 * }>
 *
 * // ✅ Adapt custom type in generic
 * // ✅ Rename it for non-duplicated imports
 * const { wind: style, wind$: style$ } = createWind<MyTailwindest>()
 *
 * export { style, style$ }
 */
function createWind<StyleType>() {
    const wind$ = <Variant extends string>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...variantNames: Variant[]
    ): typeof windCore<StyleType, VariantsStyles<Variant, StyleType>> =>
        windCore
    const wind: typeof windCore<StyleType> = windCore
    return {
        wind$,
        wind,
    }
}

const defaultWind = createWind<Tailwindest>()

/**
 * @note Create complex `tailwind` style definition with `wind`
 * @note Basic wind function
 * @example
 * // ✅ Create complex style with wind
 * const box = wind(
 *   { ...boxStyle },
 * )
 * // ✅ Use class
 * const boxClass = box.class()
 *
 * // 📸 Pre-consolidate as class string for render performance
 * const container = wind(
 *   { ...containerStyle },
 * ).class()
 */
const wind = defaultWind.wind

/**
 * @note Create complex `tailwind` style definition with variants with `wind$`
 * @note Variants wind function
 * @example
 * // ✅ Create complex variant styles with wind$
 * const button = wind$("success", "fail")(
 *   { ...buttonBaseStyle },
 *   {
 *       // ✅ Define variants style
 *       success: { ...successStyle },
 *       fail: { ...failStyle },
 *   }
 * )
 * // ✅ Get base style without argument
 * const buttonBaseClass = button.class()
 *
 * // ✅ Get specific variants with argument
 * const buttonSuccessClass = button.class("success")
 */
const wind$ = defaultWind.wind$

/**
 * @note Get variants `union` of `wind`
 * @returns Type `string union` or `never`
 * @example
 * // ✅ Get "success" | "fail"
 * type BtnVariants = WindVariants<typeof SUCCESS_FAIL_BTN>
 *
 * // ❌ Get never
 * type BtnVariants2 = WindVariants<typeof NO_VARIANTS_BTN>
 */
export type WindVariants<TypeofWind> = TypeofWind extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? Variants
        : never
    : TypeofWind extends (variants: infer Variants) => unknown
    ? Exclude<Variants, undefined>
    : never

export { createWind, wind, wind$ }
