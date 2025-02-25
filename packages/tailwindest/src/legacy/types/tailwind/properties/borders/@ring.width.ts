import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for creating outline rings with box-shadows.
     *@see {@link https://tailwindcss.com/docs/ring-width ring width}
     */
    ringWidth: TailwindRingWidth<Plug>
}
