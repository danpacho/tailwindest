import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindWillChangeVariants =
    | "auto"
    | "scroll"
    | "contents"
    | "transform"
    | TailwindArbitrary

type TailwindWillChange<Plug extends PlugBase = ""> = `will-change-${
    | TailwindWillChangeVariants
    | Pluggable<Plug>}`
export type TailwindWillChangeType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for optimizing upcoming animations of elements that are expected to change.
     *@see {@link https://tailwindcss.com/docs/will-change will change}
     */
    willChange: TailwindWillChange<Plug>
}
