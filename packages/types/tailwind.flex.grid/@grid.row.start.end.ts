import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindGridRowStartEndVarients =
    | "auto"
    | "span-1"
    | "span-2"
    | "span-3"
    | "span-4"
    | "span-5"
    | "span-6"
    | "span-full"
    | "start-1"
    | "start-2"
    | "start-3"
    | "start-4"
    | "start-5"
    | "start-6"
    | "start-7"
    | "start-auto"
    | "end-1"
    | "end-2"
    | "end-3"
    | "end-4"
    | "end-5"
    | "end-6"
    | "end-7"
    | "end-auto"
    | TailwindArbitrary
type TailwindGridRowStartEnd = `row-${TailwindGridRowStartEndVarients}`
export type TailwindGridRowStartEndType = {
    /**
     *@note Utilities for controlling how elements are sized and placed across grid rows.
     *@docs [grid-row](https://tailwindcss.com/docs/grid-row)
     */
    gridRow: TailwindGridRowStartEnd
}
