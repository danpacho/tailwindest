import { cache, deepMerge, getCachedValue, getTailwindClass } from "./core"

type ToString<MightBeString> = Extract<MightBeString, string>
export type VariantsStyles<Variant extends string, StyleType> = Record<
    Variant,
    StyleType
> & {
    default?: WindVariantsKey<Variant>
}

type DefaultWindVariantOptionKey = "default"
export type WindVariantsKey<Variants> = ToString<
    Exclude<Variants, DefaultWindVariantOptionKey | undefined | null>
>

/** Base cache key for `style` and `class` */
const BASE_KEY = Symbol()
type WindCacheKey = string | symbol | number

type ClassNameType = string
/**
 * @param style style object
 * @param variantsStyles optional variants style objects
 */
function wind<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(
    style: StyleType,
    variantsStyles: VariantsStylesType
): {
    /**
     * Class extractor `function`
     * @example
     * // ✅ Define box with "container" | "flex" variants
     * const box = wind$("container", "flex")(
     *      {
     *         ...defaultStyle,
     *      },
     *      {
     *          container: { ...containerStyle },
     *          flex: { ...flexStyle },
     *          // ✅ Optionally set default variant
     *          default: "flex",
     *      }
     * )
     * // ✅ Get container variant class string
     * const container = box.class("container")
     * // ✅ Get baseStyle class string, set to "flex"
     * const flex = box.class()
     */
    class: (
        variant?: WindVariantsKey<keyof VariantsStylesType>
    ) => ClassNameType
    /**
     * Input style extractor `function`, use it to compose styles
     * @example
     * // ✅ Define box with "container" | "flex" variants
     * const box = wind$("container", "flex")(
     *      {
     *         ...defaultStyle,
     *      },
     *      {
     *          container: { ...containerStyle },
     *          flex: { ...flexStyle },
     *          // ✅ Optionally set default variant
     *          default: "flex",
     *      }
     * )
     * const container = boxStyle.style("container")
     */
    style: (variant?: WindVariantsKey<keyof VariantsStylesType>) => StyleType
    /**
     * Compose multiple styles into one object
     * @example
     * // ✅ Get composed result of baseStyle & flexStyle & borderStyle
     * const btn = wind$("active", "disabled")(
     *      { ...baseStyle },
     *      {
     *          active: { ...activeStyle },
     *          disabled: { ...defaultStyle },
     *      }
     * ).compose(flexStyle, borderStyle)
     */
    compose: (...styles: StyleType[]) => {
        class: (
            variant?: WindVariantsKey<keyof VariantsStylesType>
        ) => ClassNameType
        style: (
            variant?: WindVariantsKey<keyof VariantsStylesType>
        ) => StyleType
    }
}
function wind<StyleType>(style: StyleType): {
    /**
     * Class extractor `function`
     * @example
     * // ✅ Define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ Get btn class string
     * const buttonClass = button.class()
     */
    class: () => ClassNameType
    /**
     * Input style extractor `function`, use it to compose styles
     * @example
     * // ✅ Define btn style
     * const button = wind()({ ...btnStyle })
     *
     * // ✅ Get button style object
     * const butonStyle = button.style()
     */
    style: () => StyleType
    /**
     * Compose multiple styles into one object
     * @example
     * // ✅ Get composed result of btnStyle & borderStyle
     * const buttonWithBorder = wind(
     *      { ...btnStyle },
     * ).compose(borderStyle)
     */
    compose: (...styles: StyleType[]) => {
        /**
         * Class extractor `function`
         * @example
         * // ✅ Define btn style
         * const button = wind()({ ...btnStyle })
         *
         * // ✅ Get btn class string
         * const buttonClass = button.class()
         */
        class: () => ClassNameType
        /**
         * Input style extractor `function`, use it to compose styles
         * @example
         * // ✅ Define btn style
         * const button = wind()({ ...btnStyle })
         *
         * // ✅ Get button style object
         * const butonStyle = button.style()
         */
        style: () => StyleType
    }
}
function wind<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(style: StyleType, variantsStyles?: VariantsStylesType) {
    const classCacheStore = cache<WindCacheKey, ClassNameType>()
    const styleCacheStore = cache<WindCacheKey, StyleType>()

    return {
        class: (
            variant:
                | WindVariantsKey<keyof VariantsStylesType>
                | undefined = (variantsStyles?.default as WindVariantsKey<
                keyof VariantsStylesType
            >) ?? undefined
        ) => {
            const cachedBaseStyle = getCachedValue(
                styleCacheStore,
                BASE_KEY,
                () => style
            )
            const cachedBaseClass = getCachedValue(
                classCacheStore,
                BASE_KEY,
                () => getTailwindClass(cachedBaseStyle)
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseClass

            const cachedVariantStyle = getCachedValue(
                styleCacheStore,
                variant,
                () =>
                    deepMerge(
                        cachedBaseStyle,
                        variantsStyles[variant] as StyleType
                    )
            )
            const cachedVariantClass = getCachedValue(
                classCacheStore,
                variant,
                () => getTailwindClass(cachedVariantStyle)
            )

            return cachedVariantClass
        },

        style: (
            variant:
                | WindVariantsKey<keyof VariantsStylesType>
                | undefined = (variantsStyles?.default as WindVariantsKey<
                keyof VariantsStylesType
            >) ?? undefined
        ): StyleType => {
            const cachedBaseStyle = getCachedValue(
                styleCacheStore,
                BASE_KEY,
                () => style
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseStyle

            const cachedVariantStyle = getCachedValue(
                styleCacheStore,
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
            const cachedBaseStyle = getCachedValue(
                styleCacheStore,
                BASE_KEY,
                () => style
            )

            const composedStyle = styles.reduce<StyleType>(
                (accStyle, currStyle) => deepMerge(accStyle, currStyle),
                cachedBaseStyle
            )
            const composedClass = getTailwindClass(composedStyle)

            classCacheStore.set(BASE_KEY, composedClass)
            styleCacheStore.set(BASE_KEY, composedStyle)

            return {
                class: this.class,
                style: this.style,
            }
        },
    }
}

export { wind }
