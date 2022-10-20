import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindOutlineOffsetVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindOutlineOffset<Plug extends PlugBase = ""> =
    `outline-offset-${TailwindOutlineOffsetVariants<Plug>}`
export type TailwindOutlineOffsetType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the offset of an element's outline.
     *@docs [outline-offset](https://tailwindcss.com/docs/outline-offset)
     */
    outlineOffset: TailwindOutlineOffset<Plug>
}
