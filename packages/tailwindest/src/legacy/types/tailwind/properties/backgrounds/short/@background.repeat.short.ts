type TailwindBackgroundRepeatVariants = "x" | "y" | "round" | "space"
type TailwindBackgroundRepeat =
    | "bg-repeat"
    | "bg-no-repeat"
    | `bg-repeat-${TailwindBackgroundRepeatVariants}`
export type ShortTailwindBackgroundRepeatType = {
    /**
     *@description Utilities for controlling the repetition of an element's background image.
     *@see {@link https://tailwindcss.com/docs/background-repeat background repeat}
     */
    bgRepeat: TailwindBackgroundRepeat
}
