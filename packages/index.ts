import { Tailwindest as TailwindestType } from "./types/tailwindest"
import { cache, deepMerge, getCachedValue, getTailwindClass } from "./utils"

type StringKey<Key> = Extract<Key, string>
type VariantStyles<Key extends string, T> = Record<Key, T>

/** @note cache key for base `style` and `class` */
const BASE_KEY = "_" as const

/**
 * @param baseStyle base tailwind style
 * @param variantsStyles **optional** variants tailwind styles
 * @note **variant** is key of `variantsStyles`
 * @returns `class` tailwind class extractor **function**
 * @returns `style` input style extractor **function**, use it for composing styles
 * @returns `compose` composed style of wind style set
 */
function windCore<
    T extends TailwindestType,
    Styles extends VariantStyles<string, T>
>(
    baseStyle: T,
    variantsStyles: Styles
): {
    /**
     * @note class extractor `function`
     * @example
     * const boxClass = wind$("variant")({ ...yourStyles 💄 }).class("variant")
     * // 📜 returns yourStyles 💄 class string
     */
    class: (variant?: StringKey<keyof Styles>) => string
    /**
     * @note input style extractor `function`, use it to compose styles
     * @example
     * const boxStyle = wind$("variant")({ ...yourStyles 💄 }).style("variant")
     * // 📜 returns { ...yourStyles 💄 }
     */
    style: (variant?: StringKey<keyof Styles>) => T
    /**
     * @note `compose` get multiple styles and compose to one object
     * @example
     * const boxComposed = wind$("variant")({ ...yourStyles 💄 }).compose(myStyle 🎁)
     * // 📜 returns composed result of yourStyles 💄 & myStyle 🎁
     */
    compose: (...styles: T[]) => ReturnType<typeof windCore<T, Styles>>
}
function windCore<T extends TailwindestType>(
    baseStyle: T
): {
    /**
     * @note class extractor `function`
     * @example
     * const boxClass = wind({ ...yourStyles 💄 }).class()
     * // 📜 returns yourStyles 💄 class string
     */
    class: () => string
    /**
     * @note input style extractor `function`, use it to compose styles
     * @example
     * const boxStyle = wind({ ...yourStyles 💄 }).style()
     * // 📜 returns { ...yourStyles 💄 }
     */
    style: () => T
    /**
     * @note `compose` get multiple styles and compose to one object
     * @example
     * const boxComposed = wind({ ...yourStyles 💄 }).compose(myStyle 🎁)
     * // 📜 returns composed result of yourStyles 💄 & myStyle 🎁
     */
    compose: (...styles: T[]) => ReturnType<typeof windCore<T>>
}
function windCore<
    T extends TailwindestType,
    Styles extends VariantStyles<string, T>
>(baseStyle: T, variantsStyles?: Styles) {
    const classStore = cache<string>()
    const styleStore = cache<T>()

    classStore.set(BASE_KEY, getTailwindClass(baseStyle))

    return {
        class: (variant?: StringKey<keyof Styles>) => {
            const cachedBaseStyle = getCachedValue<T>(
                styleStore,
                BASE_KEY,
                () => baseStyle
            )
            const cachedBaseClass = getCachedValue<string>(
                classStore,
                BASE_KEY,
                () => getTailwindClass(cachedBaseStyle)
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseClass

            const cachedVariantStyle = getCachedValue<T>(
                styleStore,
                variant,
                () =>
                    deepMerge<T>(cachedBaseStyle, variantsStyles[variant] as T)
            )
            const cachedVariantClass = getCachedValue<string>(
                classStore,
                variant,
                () => getTailwindClass(cachedVariantStyle)
            )

            return cachedVariantClass
        },

        style: (variant?: StringKey<keyof Styles>): T => {
            const cachedBaseStyle = getCachedValue<T>(
                styleStore,
                BASE_KEY,
                () => baseStyle
            )

            const isBase = variantsStyles === undefined || variant === undefined
            if (isBase) return cachedBaseStyle

            const cachedVariantStyle = getCachedValue<T>(
                styleStore,
                variant,
                () =>
                    deepMerge<T>(cachedBaseStyle, variantsStyles[variant] as T)
            )
            return cachedVariantStyle
        },

        compose: function (
            ...styles: T[]
        ): ReturnType<typeof windCore<T, Styles>> {
            const cachedBaseStyle = getCachedValue<T>(
                styleStore,
                BASE_KEY,
                () => baseStyle
            )

            const composedStyle = styles.reduce<T>(
                (composedStyle, currStyle) =>
                    deepMerge<T>(composedStyle, currStyle),
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
 * @note createWind with `custom` type
 * @note gets generic extends `Tailwindest` type
 * @returns `wind$` - get `variants` input, should not `_`
 * @returns `wind` - just wind function
 */
function createWind<T extends TailwindestType>(): {
    wind$: <Variant extends string>(
        ...variants: Variant[]
    ) => typeof windCore<T, VariantStyles<Variant, T>>
    wind: typeof windCore<T>
}
function createWind() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const wind$ = (...variants: string[]) => windCore
    return {
        wind$,
        wind: windCore,
    }
}

const defaultWind = createWind()
/**
 * @param baseStyle base tailwind style
 * @returns `class` tailwind class extractor **function**
 * @returns `style` input style extractor **function**, use it for composing styles
 */
const wind: (
    baseStyle: TailwindestType
) => ReturnType<typeof windCore<TailwindestType>> = defaultWind.wind

/**
 * @param ...variants tailwind variant names
 * @note `variants` should not be `_`, it is default key
 * @returns `wind$(...variants)` tailwind style generator like `wind`
 */
const wind$: <Variant extends string>(
    ...variants: Variant[]
) => (
    baseStyle: TailwindestType,
    variantsStyles: VariantStyles<Variant, TailwindestType>
) => ReturnType<
    typeof windCore<TailwindestType, VariantStyles<Variant, TailwindestType>>
> = defaultWind.wind$

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
 * @note `Tailwindest` total type set
 * @example
 * type FontSize = Tailwindest["fontSize"]
 * // 📜 Get all type of tailwind fontSize
 */
export type Tailwindest = TailwindestType

export { createWind, wind, wind$ }
