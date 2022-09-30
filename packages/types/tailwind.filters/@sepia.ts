import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindSepiaVariants = "0" | TailwindArbitrary
type TailwindSepia = "sepia" | `sepia-${TailwindSepiaVariants}`
export type TailwindSepiaType = {
    /**
     *@note Utilities for applying sepia filters to an element.
     *@docs [sepia](https://tailwindcss.com/docs/sepia)
     */
    filterSepia: TailwindSepia
}

type TailwindBackdropSepia = `backdrop-sepia-${TailwindSepiaVariants}`
export type TailwindBackdropSepiaType = {
    /**
     *@note Utilities for applying backdrop sepia filters to an element.
     *@docs [backdrop-sepia](https://tailwindcss.com/docs/backdrop-sepia)
     */
    backdropSepia: TailwindBackdropSepia
}
