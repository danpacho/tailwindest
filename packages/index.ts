import { createWind } from "./create.wind"
import type { Tailwindest } from "./tailwindest"

const defaultWind = createWind<Tailwindest>()

/**
 * @note Create complex `tailwind` style definition with `wind`
 * @note Basic wind funcation
 * @example
 * // ✅ Create complex style with wind
 * const box = wind(
 *   { ...boxStyle },
 * )
 * // ✅ Use class
 * const boxClass = box.class()
 *
 * // 📸 Pre-consolidate as class string for render performance
 * const container = wind(
 *   { ...containerStyle },
 * ).class()
 */
const wind = defaultWind.wind

/**
 * @note Create complex `tailwind` style definition with variants with `wind$`
 * @note Variants wind function
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
const wind$ = defaultWind.wind$

export * from "./tailwindest"
export * from "./wind.variants"
export { createVariants } from "./utils"
export { createWind } from "./create.wind"
export { wind, wind$ }
