import { BASE_KEY } from "../../constants"
import type {
    CacheKey,
    NestedObject,
    StyleGeneratorCache,
    ToString,
} from "../../utils"
import { cache } from "../cache"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import type { StyleGeneratorRotary } from "./tool.interface"

const createRotary =
    <StyleType extends NestedObject>() =>
    <
        VariantsStylesType extends {
            [key in keyof VariantsStylesType]: StyleType
        }
    >({
        base,
        ...styles
    }: { [key in keyof VariantsStylesType]: StyleType } & {
        base?: StyleType
    }): StyleGeneratorRotary<
        StyleType,
        ToString<Exclude<keyof VariantsStylesType, "base">>
    > => {
        const rotaryCache = cache<CacheKey, StyleGeneratorCache<StyleType>>()
        let isBaseUpdated = false

        const getCachedBaseStyle = (): StyleType =>
            rotaryCache.get(BASE_KEY, () => [base ?? ({} as StyleType), ""])[0]

        const getCachedValues = (
            variant: ToString<Exclude<keyof VariantsStylesType, "base">>
        ): StyleGeneratorCache<StyleType> => {
            if (isBaseUpdated) {
                const updatedVariantStyle = deepMerge<StyleType>(
                    getCachedBaseStyle(),
                    styles[variant]
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
                    styles[variant]
                )
                return [variantStyle, getTailwindClass(variantStyle)]
            })
            return cachedVariantStyle
        }
        return {
            style: (variant) => getCachedValues(variant)[0],
            class: (variant) => getCachedValues(variant)[1],
            compose: function (...styles) {
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
