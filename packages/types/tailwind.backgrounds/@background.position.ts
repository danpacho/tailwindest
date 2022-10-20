import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBackgroundPositionVariants<Plug extends PlugBase = ""> =
    | "bottom"
    | "top"
    | "center"
    | "left"
    | "left-bottom"
    | "left-top"
    | "right"
    | "right-bottom"
    | "right-top"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindBackgroundPosition<Plug extends PlugBase = ""> =
    `bg-${TailwindBackgroundPositionVariants<Plug>}`
export type TailwindBackgroundPositionType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the position of an element's background image.
     *@docs [background-position](https://tailwindcss.com/docs/background-position)
     */
    backgroundPosition: TailwindBackgroundPosition<Plug>
}
