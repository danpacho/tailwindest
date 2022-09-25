import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindGridColumnStartEndVarients =
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
    | TailwindArbitrary
type TailwindGridColumn = `col-${TailwindGridColumnStartEndVarients}`
export type TailwindGridColumnType = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid columns.
     *@docs [grid-column](https://tailwindcss.com/docs/grid-column)
     */
    gridColumn: TailwindGridColumn
}

type TailwindGridColumnDirectionVarients =
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
type TailwindGridColumnStart =
    `col-start-${TailwindGridColumnDirectionVarients}`
export type TailwindGridColumnStartType = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid columns.
     *@docs [grid-column](https://tailwindcss.com/docs/grid-column)
     */
    gridColumnStart: TailwindGridColumnStart
}

type TailwindGridColumnEnd = `col-end-${TailwindGridColumnDirectionVarients}`
export type TailwindGridColumnEndType = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid columns.
     *@docs [grid-column](https://tailwindcss.com/docs/grid-column)
     */
    gridColumnEnd: TailwindGridColumnEnd
}
