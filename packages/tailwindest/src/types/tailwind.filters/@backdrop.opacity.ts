import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBackdropOpacityVariants<Plug extends PlugBase = ""> =
    | "0"
    | "5"
    | "10"
    | "20"
    | "25"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "75"
    | "80"
    | "90"
    | "95"
    | "100"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindBackdropOpacity<Plug extends PlugBase = ""> =
    `backdrop-opacity-${TailwindBackdropOpacityVariants<Plug>}`
export type TailwindBackdropOpacityType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop opacity filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-opacity backdrop opacity}
     */
    backdropOpacity: TailwindBackdropOpacity<Plug>
}
