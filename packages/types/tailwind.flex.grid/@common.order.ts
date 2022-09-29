import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexGridOrderVariants =
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
    | TailwindArbitrary
type TailwindFlexGridOrder = `order-${TailwindFlexGridOrderVariants}`
export type TailwindFlexGridOrderType = {
    /**
     *@note Utilities for controlling the order of flex and grid items.
     *@docs [order](https://tailwindcss.com/docs/order)
     */
    order: TailwindFlexGridOrder
}
