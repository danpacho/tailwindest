import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindLineHeightVariants<Plug extends PlugBase = ""> =
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "none"
    | "tight"
    | "snug"
    | "normal"
    | "relaxed"
    | "loose"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindLineHeight<Plug extends PlugBase = ""> =
    `leading-${TailwindLineHeightVariants<Plug>}`
export type TailwindLineHeightType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the leading (line height) of an element.
     *@docs [line-height](https://tailwindcss.com/docs/line-height)
     */
    lineHeight: TailwindLineHeight<Plug>
}
