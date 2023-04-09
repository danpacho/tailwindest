import type { NestedObject } from "./core/nested.object.type"
import { mergeProps, toggle } from "./utils"
import { VariantsStyles, wind as windCore } from "./wind"

/**
 * @description Create tools with `Tailwindest` type
 * @example
 * // ✅ Add "my-color1" | "my-color2"
 * type Custom = Tailwindest<{
 *     color: "my-color1" | "my-color2",
 * }>
 *
 * // ✅ Plug custom type in generic, get all tools
 * const { wind, wind$, mergeProps, toggle } = createWind<Custom>()
 */
const createWind = <StyleType extends NestedObject>() => {
    const wind$ = <Variant extends string>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...variantNames: Variant[]
    ): typeof windCore<StyleType, VariantsStyles<Variant, StyleType>> =>
        windCore
    const wind: typeof windCore<StyleType> = windCore

    const mergePropsWithType: typeof mergeProps<StyleType> = mergeProps
    const toggleWithType = toggle(wind)

    return {
        /**
         * @description Create `tailwind` style
         * @example
         * // ✅ Create complex style with wind
         * const box = wind(
         *   { ...boxStyle },
         * )
         * // 📸 Consolidate as [string]
         * const boxClass = box.class()
         *
         * // 📸 Consolidate as styleSheet [object]
         * const boxClass = box.style()
         */
        wind,
        /**
         * @description Create `tailwind` style with variants
         * @example
         * // ✅ Create complex variant styles with wind$
         * const button = wind$("success", "fail")(
         *   { ...buttonBaseStyle },
         *   {
         *       // ✅ Define variants style
         *       success: { ...successStyle },
         *       fail: { ...failStyle },
         *   }
         * )
         * // ✅ Get base style without argument
         * const buttonBaseClass = button.class()
         *
         * // ✅ Get specific variants with argument
         * const buttonSuccessClass = button.class("success")
         */
        wind$,
        /**
         * @description merge two styles
         * @example
         * ```tsx
         * // ✅ Add specific style props
         * const Text = ({
         *      children,
         *      borderColor,
         * }: {
         *      children: ReactNode
         *      borderColor: Tailwindest["borderColor"]
         * }) => {
         *      const { children, ...option } = props
         *      return (
         *         <p
         *             className={mergeProps(
         *                 {
         *                     // text styleSheet
         *                 },
         *                 {
         *                     // add borderColor as component props
         *                     borderColor,
         *                 }
         *             )}
         *         >
         *             {children}
         *         </p>
         *     )
         * }
         * ```
         */
        mergeProps: mergePropsWithType,
        /**
         * @description Toggling style by `boolean` condition
         * @example
         * // 💡 Boolean condition
         * const isClicked = true;
         *
         * // ✅ Toggle between two styles
         * const className = toggle(isClicked, {
         *      truthy: {
         *          backgroundColor: "bg-green-500",
         *      },
         *      falsy: {
         *          backgroundColor: "bg-red-500",
         *      },
         * })
         * // bg-green-500 (truthy)
         */
        toggle: toggleWithType,
    }
}

export { createWind }
