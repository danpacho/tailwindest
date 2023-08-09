import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindGridTemplateRowsVariants<Plug extends PlugBase = ""> =
    | "none"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindGridTemplateRows<Plug extends PlugBase = ""> =
    `grid-rows-${TailwindGridTemplateRowsVariants<Plug>}`
export type TailwindGridTemplateRowsType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for specifying the rows in a grid layout.
     *@see {@link https://tailwindcss.com/docs/grid-template-rows grid template rows}
     */
    gridTemplateRows: TailwindGridTemplateRows<Plug>
}

type TailwindGridTemplateColumnsVariants<Plug extends PlugBase = ""> =
    Pluggable<
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
        | Plug
        | TailwindArbitrary
    >

type TailwindGridTemplateColumns<Plug extends PlugBase = ""> =
    `grid-cols-${TailwindGridTemplateColumnsVariants<Plug>}`
export type TailwindGridTemplateColumnsType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for specifying the columns in a grid layout.
     *@see {@link https://tailwindcss.com/docs/grid-template-columns grid template columns}
     */
    gridTemplateColumns: TailwindGridTemplateColumns<Plug>
}
