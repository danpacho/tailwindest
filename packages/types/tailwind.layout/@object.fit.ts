import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindObjectFitVariants =
    | "contain"
    | "cover"
    | "fill"
    | "none"
    | "scale-down"
    | TailwindArbitrary
type TailwindObjectFit = `object-${TailwindObjectFitVariants}`
export type TailwindObjectFitType = {
    /**
     *@note Utilities for controlling how a replaced element's content should be resized.
     *@docs [object-fit](https://tailwindcss.com/docs/object-fit)
     */
    objectFit: TailwindObjectFit
}
