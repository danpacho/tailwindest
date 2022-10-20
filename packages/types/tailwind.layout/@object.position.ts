import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindObjectPositionVariants<Plug extends PlugBase = ""> =
    | "top"
    | "center"
    | "bottom"
    | "left"
    | "left-top"
    | "left-bottom"
    | "right"
    | "right-top"
    | "right-bottom"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindObjectPosition<Plug extends PlugBase = ""> =
    `object-${TailwindObjectPositionVariants<Plug>}`
export type TailwindObjectPositionType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how a replaced element's content should be positioned within its container.
     *@docs [object-position](https://tailwindcss.com/docs/object-position)
     */
    objectPosition: TailwindObjectPosition<Plug>
}
