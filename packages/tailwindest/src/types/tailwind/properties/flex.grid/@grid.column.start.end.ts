import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindGridColumnVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "span-1"
    | "span-2"
    | "span-3"
    | "span-4"
    | "span-5"
    | "span-6"
    | "span-7"
    | "span-8"
    | "span-9"
    | "span-10"
    | "span-11"
    | "span-12"
    | "span-full"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindGridColumn<Plug extends PlugBase = ""> =
    `col-${TailwindGridColumnVariants<Plug>}`
export type TailwindGridColumnType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how elements are sized and placed across grid columns.
     *@see {@link https://tailwindcss.com/docs/grid-column grid column}
     */
    gridColumn: TailwindGridColumn<Plug>
}

type TailwindGridColumnDirectionVariants =
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
    | "13"
    | "auto"
    | TailwindArbitrary

type TailwindGridColumnStart<Plug extends PlugBase = ""> = `col-start-${
    | TailwindGridColumnDirectionVariants
    | Pluggable<Plug>}`
export type TailwindGridColumnStartType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how elements are sized and placed across grid columns.
     *@see {@link https://tailwindcss.com/docs/grid-column grid column start}
     */
    gridColumnStart: TailwindGridColumnStart<Plug>
}

type TailwindGridColumnEnd<Plug extends PlugBase = ""> = `col-end-${
    | TailwindGridColumnDirectionVariants
    | Pluggable<Plug>}`
export type TailwindGridColumnEndType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how elements are sized and placed across grid columns.
     *@see {@link https://tailwindcss.com/docs/grid-column grid column end}
     */
    gridColumnEnd: TailwindGridColumnEnd<Plug>
}
