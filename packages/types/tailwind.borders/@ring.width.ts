import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindRingWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | "inset"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindRingWidth<Plug extends PlugBase = ""> =
    | "ring"
    | `ring-${TailwindRingWidthVariants<Plug>}`
export type TailwindRingWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for creating outline rings with box-shadows.
     *@docs [ring-width](https://tailwindcss.com/docs/ring-width)
     */
    ringWidth: TailwindRingWidth<Plug>
}
