import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFontWeightVariants =
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black"
    | TailwindArbitrary

type TailwindFontWeight = `font-${TailwindFontWeightVariants}`
export type TailwindFontWeightType = {
    /**
     *@note Utilities for controlling the font weight of an element.
     *@docs [font-weight](https://tailwindcss.com/docs/font-weight)
     */
    fontWeight: TailwindFontWeight
}
