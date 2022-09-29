import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindOutlineWidthVariants =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | TailwindArbitrary
type TailwindOutlineWidth = `outline-${TailwindOutlineWidthVariants}`
export type TailwindOutlineWidthType = {
    /**
     *@note Utilities for controlling the width of an element's outline.
     *@docs [outline-width](https://tailwindcss.com/docs/outline-width)
     */
    outlineWidth: TailwindOutlineWidth
}
