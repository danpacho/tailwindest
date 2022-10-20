import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindListStyleTypeVariants<Plug extends PlugBase = ""> =
    | "none"
    | "disc"
    | "decimal"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindListStyleType<Plug extends PlugBase = ""> =
    `list-${TailwindListStyleTypeVariants<Plug>}`

export type TailwindListStyleTypeType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the bullet/number style of a list.
     *@docs [list-style-type](https://tailwindcss.com/docs/list-style-type)
     */
    listStyleType: TailwindListStyleType<Plug>
}
