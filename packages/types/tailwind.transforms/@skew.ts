import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindSkewVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "3"
    | "6"
    | "12"
    | TailwindArbitrary
    | Pluggable<Plug>

export type TailwindSkewType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for skewing elements with transform x direction
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewX:
        | `skew-x-${TailwindSkewVariants<Plug>}`
        | `-skew-x-${TailwindSkewVariants<Plug>}`
    /**
     *@note Utilities for skewing elements with transform y direction
     *@unit Gap `1` = `1deg`
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewY:
        | `skew-y-${TailwindSkewVariants<Plug>}`
        | `-skew-y-${TailwindSkewVariants<Plug>}`
}
