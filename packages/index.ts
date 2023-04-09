import { createWind } from "./create.wind"
import type { Tailwindest } from "./tailwindest"
import { createVariants } from "./utils"
import type { WindVariants } from "./wind.variants"

const { wind, mergeProps, toggle, wind$ } = createWind<Tailwindest>()

export {
    /**
     * @description Create `tailwind` style
     * @example
     * // ✅ Create complex style with wind
     * const box = wind(
     *   { ...boxStyle },
     * )
     * // 📸 Consolidate as string
     * const boxClass = box.class()
     *
     * // 📸 Consolidate as stylesheet object
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
     * @description Toggling a style by a boolean condition
     * @example
     * // 🚥 Boolean condition
     * const isClicked = true;
     *
     * // 🔮 Toggle between two styles
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
    toggle,
    mergeProps,
    createWind,
    createVariants,
    type Tailwindest,
    type WindVariants,
}
