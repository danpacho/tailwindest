import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindRotateVariants =
    | "0"
    | "1"
    | "2"
    | "3"
    | "6"
    | "12"
    | "45"
    | "90"
    | "180"
    | TailwindArbitrary
type TailwindRotate =
    | `rotate-${TailwindRotateVariants}`
    | `-rotate-${TailwindRotateVariants}`
export type TailwindRotateType = {
    /**
     *@note Utilities for rotating elements with transform.
     *@docs [rotate](https://tailwindcss.com/docs/rotate)
     *@unit Gap `1` = `1deg`
     */
    transformRotate: TailwindRotate
}
