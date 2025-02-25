import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling the offset of a text underline.
     *@see {@link https://tailwindcss.com/docs/text-underline-offset text underline offset}
     */
    textUnderlineOffset: TailwindTextUnderlineOffset<Plug>
}
