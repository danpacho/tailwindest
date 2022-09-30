import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindGrayscaleVariants = "0" | TailwindArbitrary
type TailwindGrayscale = "grayscale" | `grayscale-${TailwindGrayscaleVariants}`
export type TailwindGrayscaleType = {
    /**
     *@note Utilities for applying grayscale filters to an element.
     *@docs [grayscale](https://tailwindcss.com/docs/grayscale)
     */
    filterGrayscale: TailwindGrayscale
}

type TailwindBackdropGrayscale =
    | "backdrop-grayscale"
    | `backdrop-grayscale-${TailwindGrayscaleVariants}`
export type TailwindBackdropGrayscaleType = {
    /**
     *@note Utilities for applying backdrop grayscale filters to an element.
     *@docs [backdrop-grayscale](https://tailwindcss.com/docs/backdrop-grayscale)
     */
    backdropGrayscale: TailwindBackdropGrayscale
}
