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
     *@description Utilities for controlling the bullet/number style of a list.
     *@see {@link https://tailwindcss.com/docs/list-style-type list style type}
     */
    listStyleType: TailwindListStyleType<Plug>
}
