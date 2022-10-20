import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindOutlineWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindOutlineWidth<Plug extends PlugBase = ""> =
    `outline-${TailwindOutlineWidthVariants<Plug>}`
export type TailwindOutlineWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the width of an element's outline.
     *@docs [outline-width](https://tailwindcss.com/docs/outline-width)
     */
    outlineWidth: TailwindOutlineWidth<Plug>
}
