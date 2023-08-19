import {
    TailwindNestConditionIdentifierOption,
    TailwindestNestKeys,
} from "./tailwindest.nest.keys"
import type { TailwindPlugin } from "./types/tailwind"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./types/tailwind/plugin"
import type {
    GetNestStyleSheet,
    TailwindestExtendedNest,
} from "./types/tailwindest"

type TailwindestTypeSet<
    AllNestKeys extends string,
    Tailwind,
    Identifier extends string,
> = GetNestStyleSheet<AllNestKeys, Tailwind, Identifier> &
    TailwindestExtendedNest<AllNestKeys, Tailwind, Identifier>

/**
 * @description Add custom property, defined at `tailwind.config.js`
 * @see {@link https://tailwindcss.com/docs/configuration tailwind configuration}
 * @example
 * // Plug customized type to createTools generic
 * type Custom = Tailwindest<
 *    {
 *        // Add color, sizing, screens global property
 *        color: "my-color1" | "my-color2"
 *        sizing: "0.25" | "0.5" | "0.75"
 *        screens: "@ipad" | "@iphone13pro" | "@iphone13proMax"
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
export type Tailwindest<
    TailwindGlobal extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    TailwindStyle extends TailwindStylePlugOption = TailwindDefaultStylePlug,
    TailwindNestConditionPrefix extends
        TailwindNestConditionIdentifierOption = {
        breakIdentifier: "@"
        pseudoClassIdentifier: ":"
        pseudoElementIdentifier: "::"
    },
> = TailwindestTypeSet<
    TailwindestNestKeys<
        TailwindNestConditionPrefix,
        { screens: TailwindGlobal["screens"]; aria: TailwindStyle["aria"] }
    >,
    TailwindPlugin<TailwindGlobal, TailwindStyle>,
    | TailwindNestConditionPrefix["breakIdentifier"]
    | TailwindNestConditionPrefix["pseudoClassIdentifier"]
    | TailwindNestConditionPrefix["pseudoElementIdentifier"]
>
