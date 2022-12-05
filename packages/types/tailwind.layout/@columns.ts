import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindColumnsVariants<Plug extends PlugBase = ""> =
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
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindColumns<Plug extends PlugBase = ""> =
    `columns-${TailwindColumnsVariants<Plug>}`

export type TailwindColumnsType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the number of columns within an element.
     *@see {@link https://tailwindcss.com/docs/columns columns}
     */
    columns: TailwindColumns<Plug>
}
