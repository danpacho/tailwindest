import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

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
     *@note Utilities for controlling the size of implicitly-created grid columns.
     *@docs [grid-auto-columns](https://tailwindcss.com/docs/grid-auto-columns)
     */
    gridAutoColumns: TailwindGridAutoColumns<Plug>
}

type TailwindGridAutoRows<Plug extends PlugBase = ""> = `auto-rows-${
    | TailwindGridAutoCommonVariants
    | Pluggable<Plug>}`

export type TailwindGridAutoRowsType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the size of implicitly-created grid rows.
     *@docs [grid-auto-rows](https://tailwindcss.com/docs/grid-auto-rows)
     */
    gridAutoRows: TailwindGridAutoRows<Plug>
}
