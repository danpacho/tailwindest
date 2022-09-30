import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindSaturateVariants =
    | "0"
    | "50"
    | "100"
    | "150"
    | "200"
    | TailwindArbitrary
type TailwindSaturate = `saturate-${TailwindSaturateVariants}`
export type TailwindSaturateType = {
    /**
     *@note Utilities for applying saturation filters to an element.
     *@docs [saturate](https://tailwindcss.com/docs/saturate)
     */
    filterSaturate: TailwindSaturate
}

type TailwindBackdropSaturate = `backdrop-saturate-${TailwindSaturateVariants}`
export type TailwindBackdropSaturateType = {
    /**
     *@note Utilities for applying backdrop saturation filters to an element.
     *@docs [backdrop-saturate](https://tailwindcss.com/docs/backdrop-saturate)
     */
    backdropSaturate: TailwindBackdropSaturate
}
