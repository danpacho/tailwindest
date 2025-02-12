import { BASE_KEY } from "../constants"
import type { CacheKey, GetVariantsKey, StyleGeneratorCache } from "../utils"
import { CacheMap, deepMerge, getTailwindClass } from "../core"
import type { TailwindestStyler } from "./tool.interface"

const createRotary =
    <StyleType>() =>
    <VariantsStylesType>({
        base,
        ...styles
    }: { [key in keyof VariantsStylesType]: StyleType } & {
        base?: StyleType
    }): TailwindestStyler<
        StyleType,
        GetVariantsKey<Exclude<keyof VariantsStylesType, "base">>
    > => {
        let isBaseUpdated = false

        const rotaryCache = new CacheMap<
            CacheKey,
            StyleGeneratorCache<StyleType>
        >()

        const getCachedBaseStyle = (): StyleType =>
            rotaryCache.get(BASE_KEY, () => [base ?? ({} as StyleType), ""])[0]

        const getCachedValues = (
            variant: GetVariantsKey<Exclude<keyof VariantsStylesType, "base">>
        ): StyleGeneratorCache<StyleType> => {
            if (isBaseUpdated) {
                const updatedVariantStyle = deepMerge<StyleType>(
                    getCachedBaseStyle(),
                    styles[variant as keyof typeof styles]
                )
                const updated: StyleGeneratorCache<StyleType> = [
                    updatedVariantStyle,
                    getTailwindClass(updatedVariantStyle),
                ]
                rotaryCache.set(variant, updated)

                isBaseUpdated = false

                return updated
            }

            const cachedVariantStyle = rotaryCache.get(variant, () => {
                const variantStyle = deepMerge<StyleType>(
                    getCachedBaseStyle(),
                    styles[variant as keyof typeof styles]
                )
                return [variantStyle, getTailwindClass(variantStyle)]
            })

            return cachedVariantStyle
        }

        return {
            style: (variant) => getCachedValues(variant)[0],
            class: (variant) => getCachedValues(variant)[1],
            compose: function (...styles) {
                rotaryCache.reset() // reset cache

                const composedStyle = deepMerge(getCachedBaseStyle(), ...styles)
                rotaryCache.set(BASE_KEY, [
                    composedStyle,
                    getTailwindClass(composedStyle),
                ])
                isBaseUpdated = true
                return this
            },
        }
    }

export { createRotary }
