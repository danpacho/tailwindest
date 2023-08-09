import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindGradientVariants<Plug extends PlugBase = ""> =
    | "t"
    | "tr"
    | "r"
    | "br"
    | "b"
    | "bl"
    | "l"
    | "tl"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindGradient<Plug extends PlugBase = ""> =
    | "bg-none"
    | `bg-gradient-to-${TailwindGradientVariants<Plug>}`
export type TailwindBackgroundImageType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling an element's gradient background image.
     *@see {@link https://tailwindcss.com/docs/background-image gradient}
     */
    gradient: TailwindGradient<Plug>
}
