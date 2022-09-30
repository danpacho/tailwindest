import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindAnimationVariants =
    | "none"
    | "spin"
    | "ping"
    | "pulse"
    | "bounce"
    | TailwindArbitrary
type TailwindAnimation = `animate-${TailwindAnimationVariants}`
export type TailwindAnimationType = {
    /**
     *@note Utilities for animating elements with CSS animations.
     *@docs [animation](https://tailwindcss.com/docs/animation)
     */
    animation: TailwindAnimation
}
