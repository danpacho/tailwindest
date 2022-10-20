import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFontWeightVariants<Plug extends PlugBase = ""> =
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindFontWeight<Plug extends PlugBase = ""> =
    `font-${TailwindFontWeightVariants<Plug>}`
export type TailwindFontWeightType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the font weight of an element.
     *@docs [font-weight](https://tailwindcss.com/docs/font-weight)
     */
    fontWeight: TailwindFontWeight<Plug>
}
