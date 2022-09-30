import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindContrastVariants =
    | "0"
    | "50"
    | "75"
    | "100"
    | "125"
    | "150"
    | "200"
    | TailwindArbitrary
type TailwindContrast = `contrast-${TailwindContrastVariants}`
export type TailwindContrastType = {
    /**
     *@note Utilities for applying contrast filters to an element.
     *@docs [contrast](https://tailwindcss.com/docs/contrast)
     */
    filterContrast: TailwindContrast
}
