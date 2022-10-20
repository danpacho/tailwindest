import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransitionTimingFunctionVariants =
    | "in"
    | "out"
    | "linear"
    | "in-out"
    | TailwindArbitrary

type TailwindTransitionTimingFunction<Plug extends PlugBase = ""> =
    | `ease-${TailwindTransitionTimingFunctionVariants | Pluggable<Plug>}`
export type TailwindTransitionTimingFunctionType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the easing of CSS transitions.
     *@docs [transition-timing-function](https://tailwindcss.com/docs/transition-timing-function)
     */
    transitionTimingFunction: TailwindTransitionTimingFunction<Plug>
}
