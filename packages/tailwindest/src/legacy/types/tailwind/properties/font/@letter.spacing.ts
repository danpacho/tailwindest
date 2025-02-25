import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling the tracking (letter spacing) of an element.
     *@see {@link https://tailwindcss.com/docs/letter-spacing letter spacing}
     */
    letterSpacing: TailwindLetterSpacing<Plug>
}
