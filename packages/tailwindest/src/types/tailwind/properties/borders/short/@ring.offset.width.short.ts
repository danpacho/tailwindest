import { PlugBase, Pluggable } from "../../../../plugin"
import { TailwindArbitrary } from "../../common/@arbitrary"

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
export type ShortTailwindRingOffsetWidthType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for simulating an offset when adding outline rings.
     *@see {@link https://tailwindcss.com/docs/ring-offset-width ring offset width}
     */
    ringOffsetW: TailwindRingOffsetWidth<Plug>
}
