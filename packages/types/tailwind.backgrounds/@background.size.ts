type TailwindBackgroundSizeVariants = "auto" | "cover" | "contain"
type TailwindBackgroundSize = `bg-${TailwindBackgroundSizeVariants}`
export type TailwindBackgroundSizeType = {
    /**
     *@note Utilities for controlling the background size of an element's background image.
     *@docs [background-size](https://tailwindcss.com/docs/background-size)
     */
    backgroundSize: TailwindBackgroundSize
}
