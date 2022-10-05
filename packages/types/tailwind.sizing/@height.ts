import { MinSizingVariants, SizingVariants } from "./@sizing.varients"

type TailwindHeightVariants =
    | SizingVariants
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "1/5"
    | "2/5"
    | "3/5"
    | "4/5"
    | "1/6"
    | "2/6"
    | "3/6"
    | "4/6"
    | "5/6"
type TailwindHeight = `h-${TailwindHeightVariants}`
export type TailwindHeightType = {
    /**
     *@note Utilities for setting the height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [height](https://tailwindcss.com/docs/height)
     */
    height: TailwindHeight
}

type TailwindMinHeight = `min-h-${MinSizingVariants | "screen"}`
export type TailwindMinHeightType = {
    /**
     *@note Utilities for setting the minimum height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [min-height](https://tailwindcss.com/docs/min-height)
     */
    minHeight: TailwindMinHeight
}

type TailwindMaxHeightVariants = Exclude<SizingVariants, "auto"> | "screen"
type TailwindMaxHeight = `max-h-${TailwindMaxHeightVariants}`
export type TailwindMaxHeightType = {
    /**
     *@note Utilities for setting the maximum height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [max-height](https://tailwindcss.com/docs/max-height)
     */
    maxHeight: TailwindMaxHeight
}
