import type { ShortTailwindestNestKey } from "./types/plugin.nest"
import type { ShortTailwindWithOption } from "./types/tailwind.plugin"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind.plugin.option"
import type { ShortTailwindestTypeSet } from "./types/tailwindest/short"

type PlugOptionType = Record<string, unknown>

/**
 * @description Short-handed version of `Tailwindest`
 * @description Add custom property, defined at `tailwind.config.js`
 * @see {@link https://tailwindcss.com/docs/configuration tailwind configuration}
 * @example
 * // Plug customized type to createTools generic
 * type Custom = ShortTailwindest<
 *    {
 *        // Add color, sizing, screens global property
 *        color: "my-color1" | "my-color2"
 *        sizing: "0.25" | "0.5" | "0.75"
 *        screens: {
 *            // only one string union
 *            conditionA: "@do-this"
 *        }
 *    },
 *    {
 *        // Add "emoji", "my-shadow1" & "my-shadow2"
 *        listStyleType: "emoji"
 *        shadow: "my-shadow1" | "my-shadow2"
 *    }
 * >
 *
 * export const tw = createTools<Custom>()
 * @description Pick specific type
 * @example
 *
 * // ✅ Get Custom fontSize
 * type FontSize = Custom["fontSize"]
 */
export type ShortTailwindest<
    TailwindGlobal extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    TailwindStyle extends TailwindStylePlugOption = TailwindDefaultStylePlug
> = TailwindGlobal["screens"] extends PlugOptionType
    ? TailwindStyle["aria"] extends PlugOptionType
        ? Partial<
              ShortTailwindestTypeSet<
                  ShortTailwindWithOption<TailwindGlobal, TailwindStyle>,
                  ShortTailwindestNestKey<TailwindGlobal["screens"]>,
                  TailwindGlobal["screens"],
                  TailwindStyle["aria"]
              >
          >
        : Partial<
              ShortTailwindestTypeSet<
                  ShortTailwindWithOption<TailwindGlobal, TailwindStyle>,
                  ShortTailwindestNestKey<TailwindGlobal["screens"]>,
                  TailwindGlobal["screens"]
              >
          >
    : Partial<
          ShortTailwindestTypeSet<
              ShortTailwindWithOption<TailwindGlobal, TailwindStyle>,
              ShortTailwindestNestKey
          >
      >
