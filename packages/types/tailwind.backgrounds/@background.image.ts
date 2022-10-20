import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBackgroundImageVariants<Plug extends PlugBase = ""> =
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

type TailwindBackgroundImage<Plug extends PlugBase = ""> =
    | "bg-none"
    | `bg-gradient-to-${TailwindBackgroundImageVariants<Plug>}`
export type TailwindBackgroundImageType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling an element's background image.
     *@docs [background-image](https://tailwindcss.com/docs/background-image)
     */
    backgroundImage: TailwindBackgroundImage<Plug>
}
