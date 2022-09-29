type TailwindBackgroundRepeatVariants = "x" | "y" | "round" | "space"
type TailwindBackgroundRepeat =
    | "bg-repeat"
    | "bg-no-repeat"
    | `bg-repeat-${TailwindBackgroundRepeatVariants}`
export type TailwindBackgroundRepeatType = {
    /**
     *@note Utilities for controlling the repetition of an element's background image.
     *@docs [background-repeat](https://tailwindcss.com/docs/background-repeat)
     */
    backgroundRepeat: TailwindBackgroundRepeat
}
