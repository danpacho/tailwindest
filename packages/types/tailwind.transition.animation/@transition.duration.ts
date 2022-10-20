import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransitionDurationVariants =
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | TailwindArbitrary

type TailwindTransitionDuration<Plug extends PlugBase = ""> = `duration-${
    | TailwindTransitionDurationVariants
    | Pluggable<Plug>}`
export type TailwindTransitionDurationType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the duration of CSS transitions.
     *@docs [transition-duration](https://tailwindcss.com/docs/transition-duration)
     */
    transitionDuration: TailwindTransitionDuration<Plug>
}
