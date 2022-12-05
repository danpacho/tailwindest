import { VariantsStyles, wind as windCore } from "./wind"

/**
 * @description Create `wind` with custom `style` type
 * @example
 * // ✅ Add "my-color1" | "my-color2"
 * type MyTailwindest = Tailwindest<{
 *     color: "my-color1" | "my-color2",
 * }>
 *
 * // ✅ Adapt custom type in generic
 * // ✅ Rename it for non-duplicated imports
 * const { wind: style, wind$: style$ } = createWind<MyTailwindest>()
 *
 * export { style, style$ }
 */
const createWind = <StyleType>() => {
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
