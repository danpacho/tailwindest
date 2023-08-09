/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BASE_KEY } from "../../constants"
import type {
    CacheKey,
    GetVariantsKey,
    NestedObject,
    StyleGeneratorCache,
} from "../../utils"
import { cache } from "../cache"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import type { StyleGeneratorVariants } from "./tool.interface"

const createVariants =
    <StyleType extends NestedObject>() =>
    <Variants>({
        base,
        variants,
    }: {
        variants: {
            [VariantsKey in keyof Variants]: Record<
                keyof Variants[VariantsKey],
                StyleType
            >
        }
    } & {
        base?: StyleType
    }): StyleGeneratorVariants<
        StyleType,
        {
            [VariantsKey in keyof Variants]: GetVariantsKey<
                keyof Variants[VariantsKey]
            >
        }
    > => {
        type VariantsOption = {
            [VariantsKey in keyof Variants]: GetVariantsKey<
                keyof Variants[VariantsKey]
            >
        }
        const variantCache = cache<CacheKey, StyleGeneratorCache<StyleType>>()
        let isBaseUpdated = false

        const getCachedBaseStyle = (): StyleType =>
            variantCache.get(BASE_KEY, () => [base ?? ({} as StyleType), ""])[0]

        const getUpdatedVariantCacheValue = (
            variantOption: VariantsOption,
            baseStyle: StyleType
        ): StyleGeneratorCache<StyleType> => {
            const updatedVariantStyle = Object.keys(variantOption).reduce(
                (accStyle, key) =>
                    deepMerge(
                        accStyle,
                        variants[key as keyof Variants][
                            variantOption[
                                key as keyof Variants
                            ] as keyof Variants[keyof Variants]
                        ]
                    ),
                baseStyle
            )
            return [updatedVariantStyle, getTailwindClass(updatedVariantStyle)]
        }

        const getCachedVariant = (
            variantOption: VariantsOption
        ): StyleGeneratorCache<StyleType> => {
            const cachedVariantKey = Object.values(variantOption).join("")

            if (isBaseUpdated) {
                const updatedCacheValue = getUpdatedVariantCacheValue(
                    variantOption,
                    getCachedBaseStyle()
                )
                variantCache.set(cachedVariantKey, updatedCacheValue)
                isBaseUpdated = false
                return updatedCacheValue
            }

            const cachedVariant = variantCache.get(cachedVariantKey, () =>
                getUpdatedVariantCacheValue(variantOption, getCachedBaseStyle())
            )
            return cachedVariant
        }

        return {
            style: (variantOption: VariantsOption) =>
                getCachedVariant(variantOption)[0],
            class: (variantOption: VariantsOption) =>
                getCachedVariant(variantOption)[1],
            compose: function (...styles: StyleType[]) {
                variantCache.reset() // reset cache

                const composedStyle = deepMerge(getCachedBaseStyle(), ...styles)
                variantCache.set(BASE_KEY, [composedStyle, ""])
                isBaseUpdated = true
                return this
            },
        }
    }

export { createVariants }
