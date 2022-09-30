import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindInvertVariants = "0" | TailwindArbitrary
type TailwindInvert = "invert" | `invert-${TailwindInvertVariants}`
export type TailwindInvertType = {
    /**
     *@note Utilities for applying invert filters to an element.
     *@docs [invert](https://tailwindcss.com/docs/invert)
     */
    filterInvert: TailwindInvert
}

type TailwindBackdropInvert =
    | "backdrop-invert"
    | `backdrop-invert-${TailwindInvertVariants}`
export type TailwindBackdropInvertType = {
    /**
     *@note Utilities for applying backdrop invert filters to an element.
     *@docs [backdrop-invert](https://tailwindcss.com/docs/backdrop-invert)
     */
    backdropInvert: TailwindBackdropInvert
}
