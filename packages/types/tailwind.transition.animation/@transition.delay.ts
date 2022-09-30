import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransitionDelayVariants =
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | TailwindArbitrary
type TailwindTransitionDelay = `delay-${TailwindTransitionDelayVariants}`
export type TailwindTransitionDelayType = {
    /**
     *@note Utilities for controlling the delay of CSS transitions.
     *@docs [transition-delay](https://tailwindcss.com/docs/transition-delay)
     */
    transitionDelay: TailwindTransitionDelay
}
