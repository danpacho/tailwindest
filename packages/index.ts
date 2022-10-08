import { Tailwindest as TailwindestType } from "./types/tailwindest"
import { deepMerge, getTwClass } from "./utils"
import { windestCache } from "./windest.cache"

type StringKey<Key> = Extract<Key, string>
type VariantsObject = {
    [key: string]: TailwindestType
}

/**
 * @param baseStyle base tailwind style
 * @param variantsStyles **optional** variants tailwind styles
 * @note **variant** is key of `variantsStyles`
 * @returns `class` tailwind class extractor **function**
 * @returns `style` input style extractor **function**, use it for composing styles
 */
function wind<VariantsStyle extends VariantsObject>(
    baseStyle: TailwindestType,
    VariantsStyles: VariantsStyle
): {
    class: (variant?: StringKey<keyof VariantsStyle>) => string
    style: (variant?: StringKey<keyof VariantsStyle>) => TailwindestType
}
function wind(baseStyle: TailwindestType): {
    class: () => string
    style: () => TailwindestType
}

function wind<VariantsStyle extends VariantsObject>(
    baseStyle: TailwindestType,
    variantsStyles?: VariantsStyle
) {
    const { getClass, setClass, hasClass, getStyle, setStyle, hasStyle } =
        windestCache()

    const baseClass = getTwClass(baseStyle)

    return {
        class: (variant?: StringKey<keyof VariantsStyle>) => {
            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return baseClass

            const shouldCacheClass = hasClass(variant) === false
            if (shouldCacheClass) {
                const shouldCacheStyle = hasStyle(variant) === false
                if (shouldCacheStyle) {
                    const variantStyle: TailwindestType = deepMerge(
                        baseStyle,
                        variantsStyles[variant] as TailwindestType
                    )

                    const variantClass = getTwClass(variantStyle)
                    setStyle(variant, variantStyle)
                    setClass(variant, variantClass)
                    return variantClass
                }
                const cachedStyle = getStyle(variant) as TailwindestType
                const variantClass = getTwClass(cachedStyle)
                setClass(variant, variantClass)
                return variantClass
            }

            const cachedClass = getClass(variant) as string
            return cachedClass
        },

        style: (variant?: StringKey<keyof VariantsStyle>): TailwindestType => {
            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return baseStyle

            const shouldCacheStyle = hasStyle(variant) === false
            if (shouldCacheStyle && variantsStyles[variant]) {
                const variantStyle: TailwindestType = deepMerge(
                    baseStyle,
                    variantsStyles[variant] as TailwindestType
                )
                setStyle(variant, variantStyle)
                return variantStyle
            }

            const cachedStyle = getStyle(variant) as TailwindestType
            return cachedStyle
        },
    }
}

/**
 * @param styles
 * @returns composed style of wind style set
 */
function composeWind(...styles: TailwindestType[]): TailwindestType {
    return styles.reduce<TailwindestType>(
        (style, curr) => deepMerge(style, curr),
        {} as TailwindestType
    )
}

/**
 * Get variants type of `wind` style,
 * `literal union` or `never`
 * @example
 * type BtnWithSuccessFail = WindVariants<typeof success_fail_btn>
 * // 📜 "success" | "fail"
 * type BtnWithNoVariants = WindVariants<typeof no_variants_btn>
 * // 📜 never
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

/**
 * Taiwindest total type set
 * @example
 * type FontSize = Tailwindest["fontSize"]
 * // Get all type of tailwind fontSize
 */
export type Tailwindest = TailwindestType

export { wind, composeWind }
