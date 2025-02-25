import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling how elements are sized and placed across grid rows.
     *@see {@link https://tailwindcss.com/docs/grid-row grid row}
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
     *@description Utilities for controlling how elements are sized and placed across grid rows start.
     *@see {@link https://tailwindcss.com/docs/grid-row grid row start}
     */
    gridRowStart?: TailwindGridRowStart<Plug>
}

type TailwindGridRowEnd<Plug extends PlugBase = ""> = `row-end-${
    | TailwindGridRowDirectionVariants
    | Pluggable<Plug>}`
export type TailwindGridRowEndType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how elements are sized and placed across grid rows end.
     *@see {@link https://tailwindcss.com/docs/grid-row grid row end}
     */
    gridRowEnd?: TailwindGridRowEnd<Plug>
}
