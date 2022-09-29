import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindLineHeightVariants =
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "none"
    | "tight"
    | "snug"
    | "normal"
    | "relaxed"
    | "loose"
    | TailwindArbitrary
type TailwindLineHeight = `leading-${TailwindLineHeightVariants}`
export type TailwindLineHeightType = {
    /**
     *@note Utilities for controlling the leading (line height) of an element.
     *@docs [line-height](https://tailwindcss.com/docs/line-height)
     */
    lineHeight: TailwindLineHeight
}
