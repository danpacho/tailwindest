import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransitionPropertyVariants =
    | "none"
    | "all"
    | "colors"
    | "opacity"
    | "shadow"
    | "transform"
    | TailwindArbitrary

type TailwindTransitionProperty<Plug extends PlugBase = ""> =
    | "transition"
    | `transition-${TailwindTransitionPropertyVariants | Pluggable<Plug>}`
export type TailwindTransitionPropertyType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling which CSS properties transition.
     *@docs [transition-property](https://tailwindcss.com/docs/transition-property)
     */
    transitionProperty: TailwindTransitionProperty<Plug>
}
