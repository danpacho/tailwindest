/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BASE_KEY } from "../../constants"
import type { CacheKey, NestedObject, StyleGeneratorCache } from "../../utils"
import { cache } from "../cache"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import { StyleGeneratorVariants } from "./tool.interface"

const createVariants =
    <StyleType extends NestedObject>() =>
    <VariantsList>({
        base,
        variants,
    }: {
        variants: {
            [RotaryVariants in keyof VariantsList]: Record<
                keyof VariantsList[RotaryVariants],
                StyleType
            >
        }
    } & {
        base?: StyleType
    }): StyleGeneratorVariants<
        StyleType,
        {
            [Key in keyof VariantsList]: keyof VariantsList[Key]
        }
    > => {
        const variantCache = cache<CacheKey, StyleGeneratorCache<StyleType>>()
        let isBaseUpdated = false

        const getCachedBaseStyle = (): StyleType =>
            variantCache.get(BASE_KEY, () => [base ?? ({} as StyleType), ""])[0]

        const getUpdatedVariantCacheValue = (
            variantOption: {
                [Key in keyof VariantsList]: keyof VariantsList[Key]
            },
            baseStyle: StyleType
        ): StyleGeneratorCache<StyleType> => {
            const updatedVariantStyle = Object.keys(variantOption).reduce(
                (accStyle, key) =>
                    deepMerge(
                        accStyle,
                        variants[key as keyof VariantsList][
                            variantOption[key as keyof VariantsList] // variant option
                        ]
                    ),
                baseStyle
            )
            return [updatedVariantStyle, getTailwindClass(updatedVariantStyle)]
        }

        const getCachedVariant = (variantOption: {
            [Key in keyof VariantsList]: keyof VariantsList[Key]
        }) => {
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
            style: (variantOption) => getCachedVariant(variantOption)[0],
            class: (variantOption) => getCachedVariant(variantOption)[1],
            compose: function (...styles) {
                const composedStyle = deepMerge(getCachedBaseStyle(), ...styles)
                variantCache.set(BASE_KEY, [composedStyle, ""])
                isBaseUpdated = true
                return this
            },
        }
    }

export { createVariants }
