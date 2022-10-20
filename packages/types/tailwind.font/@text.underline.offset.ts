import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTextUnderlineOffsetVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindTextUnderlineOffset<Plug extends PlugBase = ""> =
    `underline-offset-${TailwindTextUnderlineOffsetVariants<Plug>}`

export type TailwindTextUnderlineOffsetType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the offset of a text underline.
     *@docs [text-underline-offset](https://tailwindcss.com/docs/text-underline-offset)
     */
    textUnderlineOffset: TailwindTextUnderlineOffset<Plug>
}
