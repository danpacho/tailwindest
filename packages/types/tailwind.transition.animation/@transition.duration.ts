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
type TailwindTransitionDuration =
    `duration-${TailwindTransitionDurationVariants}`
export type TailwindTransitionDurationType = {
    /**
     *@note Utilities for controlling the duration of CSS transitions.
     *@docs [transition-duration](https://tailwindcss.com/docs/transition-duration)
     */
    transitionDuration: TailwindTransitionDuration
}
