import type { TailwindestNestKey } from "./types/plugin.nest"
import type { TailwindWithOption } from "./types/tailwind.plugin"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind.plugin.option"
import type { TailwindestTypeSet } from "./types/tailwindest"

/**
 * @description Add custom property type defined at `tailwind.config.js`
 * @see {@link https://tailwindcss.com/docs/configuration tailwind configuration}
 *  Define custom style type
 * @example
 *
 * type Custom = Tailwindest<{
 *          // ✅ Add color, spacing, screens global type
 *          color: "my-color1" | "my-color2",
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
 * @description Pick specific type
 * @example
 *
 * // ✅ Get Custom fontSize
 * type FontSize = Custom["fontSize"]
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
