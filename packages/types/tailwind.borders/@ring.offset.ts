import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindRingOffsetWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindRingOffsetWidth<Plug extends PlugBase = ""> =
    `ring-offset-${TailwindRingOffsetWidthVariants<Plug>}`
export type TailwindRingOffsetWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for simulating an offset when adding outline rings.
     *@docs [ring-offset-width](https://tailwindcss.com/docs/ring-offset-width)
     */
    ringOffsetWidth: TailwindRingOffsetWidth<Plug>
}
