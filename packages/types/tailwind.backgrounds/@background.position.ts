type TailwindBackgroundPositionVariants =
    | "bottom"
    | "top"
    | "center"
    | "left"
    | "left-bottom"
    | "left-top"
    | "right"
    | "right-bottom"
    | "right-top"
type TailwindBackgroundPosition = `bg-${TailwindBackgroundPositionVariants}`
export type TailwindBackgroundPositionType = {
    /**
     *@note Utilities for controlling the position of an element's background image.
     *@docs [background-position](https://tailwindcss.com/docs/background-position)
     */
    backgroundPosition: TailwindBackgroundPosition
}
