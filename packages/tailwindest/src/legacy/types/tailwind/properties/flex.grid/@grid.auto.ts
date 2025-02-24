import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindGridAutoCommonVariants =
    | "auto"
    | "min"
    | "max"
    | "fr"
    | TailwindArbitrary

type TailwindGridAutoColumns<Plug extends PlugBase = ""> = `grid-cols-${
    | TailwindGridAutoCommonVariants
    | Pluggable<Plug>}`

export type TailwindGridAutoColumnsType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the size of implicitly-created grid columns.
     *@see {@link https://tailwindcss.com/docs/grid-auto-columns grid auto columns}
     */
    gridAutoColumns: TailwindGridAutoColumns<Plug>
}

type TailwindGridAutoRows<Plug extends PlugBase = ""> = `auto-rows-${
    | TailwindGridAutoCommonVariants
    | Pluggable<Plug>}`

export type TailwindGridAutoRowsType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the size of implicitly-created grid rows.
     *@see {@link https://tailwindcss.com/docs/grid-auto-rows grid auto rows}
     */
    gridAutoRows: TailwindGridAutoRows<Plug>
}
