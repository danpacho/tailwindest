import { cache, deepMerge, getCachedValue, getTailwindClass } from "../core"
import type { NestedObject } from "../core/nested.object.type"
import type { WindVariants } from "../wind.variants"

type VariantsStyle = Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { style: (option?: any) => NestedObject }
>

type VariantsKeys<T extends VariantsStyle> = {
    [StyleKey in keyof T]?: WindVariants<T[StyleKey]>
}

/**
 * @description Create complex variants combination
 * @param variantsStyle variants style sets
 * @example
 * // ✅ Create wind$ variants style sets
 * const btnSize = wind$("sm", "md", "lg")(
 * //...
 * )
 * const btnState = wind$("warn", "default", "success")(
 * //...
 * )
 * // ✅ Define complex variants combination
 * const btn = createVariants({
 *      size: btnSize,
 *      state: btnState
 * })
 * // ✅ Use complex variants combination
 * const btnSmWarn = btn({
 *      size: "sm", // ✨ Auto completed variants
 *      state: "warn"
 * })
 */
const createVariants = <T extends VariantsStyle>(variantsStyle: T) => {
    const variantCache = cache<string, string>()
    return (variantsOption: VariantsKeys<T>): string =>
        getCachedValue(
            variantCache,
            Object.values(variantsOption).join(""),
            () =>
                getTailwindClass(
                    Object.entries(variantsStyle)
                        .map(([variantsKey, variantsWind]) => {
                            const option = variantsOption[variantsKey]
                            return option
                                ? variantsWind.style(option)
                                : variantsWind.style()
                        })
                        .reduce<NestedObject>(
                            (accStyle, currStyle) =>
                                deepMerge(accStyle, currStyle),
                            {}
                        )
                )
        )
}

export { createVariants }
