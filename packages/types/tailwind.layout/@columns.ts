import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindColumnsVariants =
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
    | "auto"
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | TailwindArbitrary
type TailwindColumns = `columns-${TailwindColumnsVariants}`

export type TailwindColumnsType = {
    /**
     *@note Utilities for controlling the number of columns within an element.
     *@docs [columns](https://tailwindcss.com/docs/columns)
     */
    columns: TailwindColumns
}
