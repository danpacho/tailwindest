import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFontFamilyVariants<Plug extends PlugBase = ""> =
    | "sans"
    | "serif"
    | "mono"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindFontFamily<Plug extends PlugBase = ""> =
    `font-${TailwindFontFamilyVariants<Plug>}`
export type TailwindFontFamilyType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the font family of an element.
     *@see {@link https://tailwindcss.com/docs/font-family font family}
     */
    fontFamily: TailwindFontFamily<Plug>
}
