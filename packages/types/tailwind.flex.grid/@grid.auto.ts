import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindGridAutoVarients =
    | "auto"
    | "min"
    | "max"
    | "fr"
    | TailwindArbitrary
type TailwindGridAutoColumns = `grid-cols-${TailwindGridAutoVarients}`
export type TailwindGridAutoColumnsType = {
    /**
     *@note Utilities for controlling the size of implicitly-created grid columns.
     *@docs [grid-auto-columns](https://tailwindcss.com/docs/grid-auto-columns)
     */
    gridAutoColumns: TailwindGridAutoColumns
}
type TailwindGridAutoRows = `auto-rows-${TailwindGridAutoVarients}`
export type TailwindGridAutoRowsType = {
    /**
     *@note Utilities for controlling the size of implicitly-created grid rows.
     *@docs [grid-auto-rows](https://tailwindcss.com/docs/grid-auto-rows)
     */
    gridAutoRows: TailwindGridAutoRows
}
