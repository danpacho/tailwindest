import { TailwindestNestKey } from "./types/plugin.nest"
import { TailwindWithOption } from "./types/tailwind.plugin"
import {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind.plugin.option"
import { TailwindestTypeSet } from "./types/tailwindest"

/**
 * @note Add custome property at `tailwind.config.js`
 * @docs [tailwind-configuration](https://tailwindcss.com/docs/configuration)
 * @note `Case1` Define custom style type
 * @example
 * type MyTailwindest = Tailwindest<{
 *          // ✅ Add color, opacity, spacing, screens global type
 *          color: "my-color1" | "my-color2",
 *          opacity: "12.5"
 *          spacing: "0.25" | "0.5" | "0.75",
 *          screens: {
 *              // ✅ only one string union
 *              conditionA: "@do-this",
 *              // ❌ more than one string union
 *              conditionB: "@dont-do-this" | "@dont-do-this-plz"
 *          }
 *      }
 *      {
 *          // ✅ Add "my-flex", "my-shadow1" & "my-shadow2"
 *          display: "my-flex",
 *          shadow: "my-shadow1" | "my-shadow2"
 *      }
 * >
 * @note `Case2` Pick specific type
 * @example
 * // ✅ Get MyTailwindest's fontSize
 * type FontSize = MyTailwindest["fontSize"]
 */
export type Tailwindest<
    TailwindCustom extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    CustomExtends extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = TailwindCustom["screens"] extends Record<string, unknown>
    ? Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
              TailwindestNestKey<TailwindCustom["screens"]>,
              TailwindCustom["screens"]
          >
      >
    : Partial<
          TailwindestTypeSet<
              TailwindWithOption<TailwindCustom, CustomExtends>,
              TailwindestNestKey
          >
      >
