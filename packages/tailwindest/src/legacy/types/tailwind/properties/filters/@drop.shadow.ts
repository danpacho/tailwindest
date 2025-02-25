import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindDropShadowVariants<Plug extends PlugBase = ""> =
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "none"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindDropShadow<Plug extends PlugBase = ""> =
    | "drop-shadow"
    | `drop-shadow-${TailwindDropShadowVariants<Plug>}`
export type TailwindDropShadowType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying drop-shadow filters to an element.
     *@see {@link https://tailwindcss.com/docs/drop-shadow drop shadow}
     */
    filterDropShadow: TailwindDropShadow<Plug>
}
