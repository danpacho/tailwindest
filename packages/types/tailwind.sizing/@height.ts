import { MinSizingVarients, SizingVarients } from "./@sizing.varients"

type TailwindHeightVarients =
    | SizingVarients
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
type TailwindHeight = `h-${TailwindHeightVarients}`
export type TailwindHeightType = {
    /**
     *@note Utilities for setting the height of an element.
     *@docs [height](https://tailwindcss.com/docs/height)
     */
    height: TailwindHeight
}

type TailwindMinHeight = `min-h-${MinSizingVarients}`
export type TailwindMinHeightType = {
    /**
     *@note Utilities for setting the minimum height of an element.
     *@docs [min-height](https://tailwindcss.com/docs/min-height)
     */
    minHeight: TailwindMinHeight
}

type TailwindMaxHeightVarients = Exclude<SizingVarients, "auto">
type TailwindMaxHeight = `max-h-${TailwindMaxHeightVarients}`
export type TailwindMaxHeightType = {
    /**
     *@note Utilities for setting the maximum height of an element.
     *@docs [max-height](https://tailwindcss.com/docs/max-height)
     */
    maxHeight: TailwindMaxHeight
}
