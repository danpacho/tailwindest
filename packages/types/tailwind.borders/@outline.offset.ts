import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindOutlineOffsetVariants =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | TailwindArbitrary
type TailwindOutlineOffset = `outline-offset-${TailwindOutlineOffsetVariants}`
export type TailwindOutlineOffsetType = {
    /**
     *@note Utilities for controlling the offset of an element's outline.
     *@docs [outline-offset](https://tailwindcss.com/docs/outline-offset)
     */
    outlineOffset: TailwindOutlineOffset
}
