import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindLetterSpacingVariants =
    | "tighter"
    | "tight"
    | "normal"
    | "wide"
    | "wider"
    | "widest"
    | TailwindArbitrary
type TailwindLetterSpacing = `tracking-${TailwindLetterSpacingVariants}`
export type TailwindLetterSpacingType = {
    /**
     *@note Utilities for controlling the tracking (letter spacing) of an element.
     *@docs [letter-spacing](https://tailwindcss.com/docs/letter-spacing)
     */
    letterSpacing: TailwindLetterSpacing
}
