import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindLetterSpacingVariants<Plug extends PlugBase = ""> =
    | "tighter"
    | "tight"
    | "normal"
    | "wide"
    | "wider"
    | "widest"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindLetterSpacing<Plug extends PlugBase = ""> =
    `tracking-${TailwindLetterSpacingVariants<Plug>}`
export type TailwindLetterSpacingType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the tracking (letter spacing) of an element.
     *@docs [letter-spacing](https://tailwindcss.com/docs/letter-spacing)
     */
    letterSpacing: TailwindLetterSpacing<Plug>
}
