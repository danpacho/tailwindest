import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling how a replaced element's content should be resized.
     *@see {@link https://tailwindcss.com/docs/object-fit object fit}
     */
    objectFit: TailwindObjectFit
}
