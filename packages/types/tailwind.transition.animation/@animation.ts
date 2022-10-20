import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindAnimationVariants<Plug extends PlugBase = ""> =
    | "none"
    | "spin"
    | "ping"
    | "pulse"
    | "bounce"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindAnimation<Plug extends PlugBase = ""> =
    `animate-${TailwindAnimationVariants<Plug>}`
export type TailwindAnimationType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for animating elements with CSS animations.
     *@docs [animation](https://tailwindcss.com/docs/animation)
     */
    animation: TailwindAnimation<Plug>
}
