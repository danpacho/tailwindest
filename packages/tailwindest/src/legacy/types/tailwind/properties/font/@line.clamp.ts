import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindLineClampVariants<Plug extends PlugBase = ""> =
    | "none"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | Pluggable<Plug>
    | TailwindArbitrary
type TailwindLineClamp<Plug extends PlugBase = ""> =
    `line-clamp-${TailwindLineClampVariants<Plug>}`

export type TailwindLineClampType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for clamping text to a specific number of lines.
     *@see {@link https://tailwindcss.com/docs/line-clamp line clamp}
     */
    lineClamp: TailwindLineClamp<Plug>
}
