import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindGridRowVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "span-1"
    | "span-2"
    | "span-3"
    | "span-4"
    | "span-5"
    | "span-6"
    | "span-full"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindGridRow<Plug extends PlugBase = ""> =
    `row-${TailwindGridRowVariants<Plug>}`
export type TailwindGridRowType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid rows.
     *@docs [grid-row](https://tailwindcss.com/docs/grid-row)
     */
    gridRow: TailwindGridRow<Plug>
}

type TailwindGridRowDirectionVariants =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "auto"
    | TailwindArbitrary

type TailwindGridRowStart<Plug extends PlugBase = ""> = `row-start-${
    | TailwindGridRowDirectionVariants
    | Pluggable<Plug>}`
export type TailwindGridRowStartType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid rows start.
     *@docs [grid-row-start](https://tailwindcss.com/docs/grid-row)
     */
    gridRowStart?: TailwindGridRowStart<Plug>
}

type TailwindGridRowEnd<Plug extends PlugBase = ""> = `row-end-${
    | TailwindGridRowDirectionVariants
    | Pluggable<Plug>}`
export type TailwindGridRowEndType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid rows end.
     *@docs [grid-row-end](https://tailwindcss.com/docs/grid-row)
     */
    gridRowEnd?: TailwindGridRowEnd<Plug>
}
