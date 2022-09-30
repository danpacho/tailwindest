type TailwindTransitionTimingFunctionVariants =
    | "in"
    | "out"
    | "linear"
    | "in-out"
type TailwindTransitionTimingFunction =
    `ease-${TailwindTransitionTimingFunctionVariants}`
export type TailwindTransitionTimingFunctionType = {
    /**
     *@note Utilities for controlling the easing of CSS transitions.
     *@docs [transition-timing-function](https://tailwindcss.com/docs/transition-timing-function)
     */
    transitionTimingFunction: TailwindTransitionTimingFunction
}
