import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { MinSizingVariants, SizingVariants } from "./@sizing.varients"

type TailwindSizingVariants =
    | SizingVariants
    | "1/2"
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
    | "1/12"
    | "2/12"
    | "3/12"
    | "4/12"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
type TailwindWidth = `w-${TailwindSizingVariants}`
export type TailwindWidthType = {
    /**
     *@note Utilities for setting the width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [width](https://tailwindcss.com/docs/width)
     */
    width: TailwindWidth
}

type TailwindMinWidth = `min-w-${MinSizingVariants}`
export type TailwindMinWidthType = {
    /**
     *@note Utilities for setting the minimum width of an element.
     *@docs [min-width](https://tailwindcss.com/docs/min-width)
     */
    minWidth: TailwindMinWidth
}

type TailwindMaxWidthVariants =
    | "0"
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full"
    | "min"
    | "max"
    | "fit"
    | "prose"
    | "screen-sm"
    | "screen-md"
    | "screen-lg"
    | "screen-xl"
    | "screen-2xl"
    | TailwindArbitrary
type TailwindMaxWidth = `max-w-${TailwindMaxWidthVariants}`
export type TailwindMaxWidthType = {
    /**
     *@note Utilities for setting the maximum width of an element.
     *@docs [max-width](https://tailwindcss.com/docs/max-width)
     */
    maxWidth: TailwindMaxWidth
}
