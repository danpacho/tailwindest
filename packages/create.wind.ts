import type { NestedObject } from "./core/nested.object.type"
import { VariantsStyles, wind as windCore } from "./wind"

/**
 * @description Create `wind`, `wind$` with customized `Tailwindest`
 * @example
 * // ✅ Add "my-color1" | "my-color2"
 * type Custom = Tailwindest<{
 *     color: "my-color1" | "my-color2",
 * }>
 *
 * // ✅ Plug custom type in generic
 * const { wind: tw, wind$: tw$ } = createWind<Custom>()
 *
 * // 💡 Rename it for non-duplicated imports
 * export { tw, tw$ }
 */
const createWind = <StyleType extends NestedObject>() => {
    const wind$ = <Variant extends string>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...variantNames: Variant[]
    ): typeof windCore<StyleType, VariantsStyles<Variant, StyleType>> =>
        windCore
    const wind: typeof windCore<StyleType> = windCore
    return {
        wind$,
        wind,
    }
}

export { createWind }
