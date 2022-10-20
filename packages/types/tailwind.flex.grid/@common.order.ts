import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexGridOrderVariants<Plug extends PlugBase = ""> =
    | "first"
    | "last"
    | "none"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindFlexGridOrder<Plug extends PlugBase = ""> =
    `order-${TailwindFlexGridOrderVariants<Plug>}`
export type TailwindFlexGridOrderType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the order of flex and grid items.
     *@docs [order](https://tailwindcss.com/docs/order)
     */
    order: TailwindFlexGridOrder<Plug>
}
