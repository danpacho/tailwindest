type TailwindBackgroundRepeatVariants = "x" | "y" | "round" | "space"
type TailwindBackgroundRepeat =
    | "bg-repeat"
    | "bg-no-repeat"
    | `bg-repeat-${TailwindBackgroundRepeatVariants}`
export type TailwindBackgroundRepeatType = {
    /**
     *@description Utilities for controlling the repetition of an element's background image.
     *@see {@link https://tailwindcss.com/docs/background-repeat background repeat}
     */
    backgroundRepeat: TailwindBackgroundRepeat
}
