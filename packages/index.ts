import { createWind } from "./create.wind"
import type { Tailwindest } from "./tailwindest"

const defaultWind = createWind<Tailwindest>()

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
const wind = defaultWind.wind

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
const wind$ = defaultWind.wind$

export * from "./tailwindest"
export * from "./wind.variants"
export * from "./utils"
export { createWind } from "./create.wind"
export { wind, wind$ }
