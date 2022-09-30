type TailwindTransitionPropertyVariants =
    | "none"
    | "all"
    | "colors"
    | "opacity"
    | "shadow"
    | "transform"
type TailwindTransitionProperty =
    | "transition"
    | `transition-${TailwindTransitionPropertyVariants}`
export type TailwindTransitionPropertyType = {
    /**
     *@note Utilities for controlling which CSS properties transition.
     *@docs [transition-property](https://tailwindcss.com/docs/transition-property)
     */
    transitionProperty: TailwindTransitionProperty
}
