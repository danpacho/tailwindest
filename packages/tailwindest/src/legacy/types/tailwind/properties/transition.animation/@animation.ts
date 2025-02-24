import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for animating elements with CSS animations.
     *@see {@link https://tailwindcss.com/docs/animation animation}
     */
    animation: TailwindAnimation<Plug>
}
