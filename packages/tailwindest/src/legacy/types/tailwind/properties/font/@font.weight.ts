import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling the font weight of an element.
     *@see {@link https://tailwindcss.com/docs/font-weight font weight}
     */
    fontWeight: TailwindFontWeight<Plug>
}
