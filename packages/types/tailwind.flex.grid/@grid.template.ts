import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindGridTemplateRowsVarients =
    | "none"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | TailwindArbitrary
type TailwindGridTemplateRows = `grid-rows-${TailwindGridTemplateRowsVarients}`
export type TailwindGridTemplateRowsType = {
    /**
     *@note Utilities for specifying the rows in a grid layout.
     *@docs [grid-template-rows](https://tailwindcss.com/docs/grid-template-rows)
     */
    gridTemplateRows: TailwindGridTemplateRows
}

type TailwindGridTemplateColumnsVarients =
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
type TailwindGridTemplateColumns =
    `grid-cols-${TailwindGridTemplateColumnsVarients}`
export type TailwindGridTemplateColumnsType = {
    /**
     *@note Utilities for specifying the columns in a grid layout.
     *@docs [grid-template-columns](https://tailwindcss.com/docs/grid-template-columns)
     */
    gridTemplateColumns: TailwindGridTemplateColumns
}
