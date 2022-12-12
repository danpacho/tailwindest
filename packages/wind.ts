import { cache, deepMerge, getTailwindClass } from "./core"

type ToString<MightBeString> = Extract<MightBeString, string>
export type VariantsStyles<Variant extends string, StyleType> = Record<
    Variant,
    StyleType
> & {
    defaultVariant?: VariantsList<Variant>
}

type DefaultVariantOptionName = "defaultVariant"
export type VariantsList<Variants> = ToString<
    Exclude<Variants, DefaultVariantOptionName | undefined | null>
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
     *         ...commonStyle,
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
    class: (variant?: VariantsList<keyof VariantsStylesType>) => ClassNameType
    /**
     * Input style extractor `function`, use it to compose styles
     * @example
     * // ✅ Define box with "container" | "flex" variants
     * const box = wind$("container", "flex")(
     *      {
     *         ...commonStyle,
     *      },
     *      {
     *          container: { ...containerStyle },
     *          flex: { ...flexStyle },
     *          // ✅ Optionally set default variant
     *          defaultVariant: "flex",
     *      }
     * )
     * const container = boxStyle.style("container")
     */
    style: (variant?: VariantsList<keyof VariantsStylesType>) => StyleType
    /**
     * Compose multiple styles into one object
     * @example
     * // ✅ Get composed result of commonStyle & flexStyle & borderStyle
     * const btn = wind$("active", "disabled")(
     *      { ...commonStyle },
     *      {
     *          active: { ...activeStyle },
     *          disabled: { ...defaultStyle },
     *      }
     * ).compose(flexStyle, borderStyle)
     */
    compose: (...styles: StyleType[]) => {
        class: (
            variant?: VariantsList<keyof VariantsStylesType>
        ) => ClassNameType
        style: (variant?: VariantsList<keyof VariantsStylesType>) => StyleType
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
     * const buttonStyle = button.style()
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
         * const buttonStyle = button.style()
         */
        style: () => StyleType
    }
}
function wind<
    StyleType,
    VariantsStylesType extends VariantsStyles<string, StyleType>
>(style: StyleType, variantsStyles?: VariantsStylesType) {
    const classStore = cache<WindCacheKey, ClassNameType>()
    const styleStore = cache<WindCacheKey, StyleType>()

    return {
        class: (
            variant:
                | VariantsList<keyof VariantsStylesType>
                | undefined = (variantsStyles?.defaultVariant as VariantsList<
                keyof VariantsStylesType
            >) ?? undefined
        ) => {
            const cachedBaseStyle = styleStore.get(BASE_KEY, () => style)
            const cachedBaseClass = classStore.get(BASE_KEY, () =>
                getTailwindClass(cachedBaseStyle)
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseClass

            const cachedVariantStyle = styleStore.get(variant, () =>
                deepMerge(cachedBaseStyle, variantsStyles[variant] as StyleType)
            )
            const cachedVariantClass = classStore.get(variant, () =>
                getTailwindClass(cachedVariantStyle)
            )

            return cachedVariantClass
        },

        style: (
            variant:
                | VariantsList<keyof VariantsStylesType>
                | undefined = (variantsStyles?.defaultVariant as VariantsList<
                keyof VariantsStylesType
            >) ?? undefined
        ): StyleType => {
            const cachedBaseStyle = styleStore.get(BASE_KEY, () => style)

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseStyle

            const cachedVariantStyle = styleStore.get(variant, () =>
                deepMerge(cachedBaseStyle, variantsStyles[variant] as StyleType)
            )
            return cachedVariantStyle
        },

        compose: function (...styles: StyleType[]) {
            const cachedBaseStyle = styleStore.get(BASE_KEY, () => style)

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

export { wind }
