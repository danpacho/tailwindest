/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { NestedObject, ToString } from "../../utils"
import { cache } from "../cache"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"
import { createRotary } from "./create.rotary"
import type { StyleGeneratorRotary } from "./tool.interface"

const createVariants = <StyleType extends NestedObject>() => {
    const rotary = createRotary<StyleType>()
    const variantCache = cache<string, string>()
    const rotaryCache = new Map<
        string,
        StyleGeneratorRotary<StyleType, string>
    >()

    return <VariantsList>(variantsStyle: {
        [RotaryVariants in keyof VariantsList]: Record<
            keyof VariantsList[RotaryVariants],
            StyleType
        > & {
            base?: StyleType
        }
    }) => {
        Object.entries<{
            [key in string]: StyleType
        }>(variantsStyle).forEach(([variant, rotaryStyles]) => {
            rotaryCache.set(variant, rotary(rotaryStyles))
        })

        return (variantsOption: {
            [Key in keyof VariantsList]: Exclude<
                ToString<keyof VariantsList[Key]>,
                "base"
            >
        }): string => {
            const variantKeys = Object.keys(variantsOption)
            const variantValues = Object.values(variantsOption)

            return variantCache.get(variantValues.join(""), () =>
                getTailwindClass(
                    variantKeys
                        .map((variantOptionKey) =>
                            rotaryCache
                                .get(variantOptionKey)!
                                .style(
                                    variantsOption[
                                        variantOptionKey as keyof VariantsList
                                    ] satisfies string
                                )
                        )
                        .reduce(
                            (accStyle, currStyle) =>
                                deepMerge(accStyle, currStyle),
                            {}
                        )
                )
            )
        }
    }
}

export { createVariants }
