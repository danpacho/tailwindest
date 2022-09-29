import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindRingWidthVariants =
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | "inset"
    | TailwindArbitrary
type TailwindRingWidth = "ring" | `ring-${TailwindRingWidthVariants}`
export type TailwindRingWidthType = {
    /**
     *@note Utilities for creating outline rings with box-shadows.
     *@docs [ring-width](https://tailwindcss.com/docs/ring-width)
     */
    ringWidth: TailwindRingWidth
}
