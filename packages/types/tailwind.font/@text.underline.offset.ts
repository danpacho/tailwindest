import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTextUnderlineOffsetVariants =
    | "auto"
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | TailwindArbitrary
type TailwindTextUnderlineOffset =
    `underline-offset-${TailwindTextUnderlineOffsetVariants}`
export type TailwindTextUnderlineOffsetType = {
    /**
     *@note Utilities for controlling the offset of a text underline.
     *@docs [text-underline-offset](https://tailwindcss.com/docs/text-underline-offset)
     */
    textUnderlineOffset: TailwindTextUnderlineOffset
}
