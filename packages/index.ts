import { Tailwindest } from "./types/tailwindest"
import { deepMerge, getTwClass } from "./utils"
import { windestCache } from "./windest.cache"

type StringKey<Key> = Extract<Key, string>
type VariantsObject = {
    [key: string]: Tailwindest
}

/**
 * @param baseStyle base tailwind style
 * @param variantsStyles **optional** variants tailwind styles
 * @note **variant** is key of `variantsStyles`
 * @returns `class` tailwind class extractor **function**
 * @returns `style` input style extractor **function**, use it for composing styles
 */
function wind<VariantsStyle extends VariantsObject>(
    baseStyle: Tailwindest,
    VariantsStyles: VariantsStyle
): {
    class: (variant?: StringKey<keyof VariantsStyle>) => string
    style: (variant?: StringKey<keyof VariantsStyle>) => Tailwindest
}
function wind(baseStyle: Tailwindest): {
    class: () => string
    style: () => Tailwindest
}

function wind<VariantsStyle extends VariantsObject>(
    baseStyle: Tailwindest,
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
                    const variantStyle: Tailwindest = deepMerge(
                        baseStyle,
                        variantsStyles[variant] as Tailwindest
                    )

                    const variantClass = getTwClass(variantStyle)
                    setStyle(variant, variantStyle)
                    setClass(variant, variantClass)
                    return variantClass
                }
                const cachedStyle = getStyle(variant) as Tailwindest
                const variantClass = getTwClass(cachedStyle)
                setClass(variant, variantClass)
                return variantClass
            }

            const cachedClass = getClass(variant) as string
            return cachedClass
        },

        style: (variant?: StringKey<keyof VariantsStyle>): Tailwindest => {
            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return baseStyle

            const shouldCacheStyle = hasStyle(variant) === false
            if (shouldCacheStyle && variantsStyles[variant]) {
                const variantStyle: Tailwindest = deepMerge(
                    baseStyle,
                    variantsStyles[variant] as Tailwindest
                )
                setStyle(variant, variantStyle)
                return variantStyle
            }

            const cachedStyle = getStyle(variant) as Tailwindest
            return cachedStyle
        },
    }
}

/**
 * @param styles
 * @returns composed style of wind style set
 */
function composeWind(...styles: Tailwindest[]): Tailwindest {
    return styles.reduce<Tailwindest>(
        (style, curr) => ({ ...style, ...curr }),
        {} as Tailwindest
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

export { wind, composeWind }
