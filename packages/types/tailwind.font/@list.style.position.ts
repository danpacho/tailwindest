type TailwindListStylePositionVariants = "inside" | "outside"
type TailwindListStylePosition = `list-${TailwindListStylePositionVariants}`
export type TailwindListStylePositionType = {
    /**
     *@note Utilities for controlling the position of bullets/numbers in lists.
     *@docs [list-style-position](https://tailwindcss.com/docs/list-style-position)
     */
    listStylePosition: TailwindListStylePosition
}
