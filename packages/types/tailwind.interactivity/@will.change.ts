import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

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
     *@note Utilities for optimizing upcoming animations of elements that are expected to change.
     *@docs [will-change](https://tailwindcss.com/docs/will-change)
     */
    willChange: TailwindWillChange<Plug>
}
