import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type GapVariants =
    | "96"
    | "80"
    | "72"
    | "64"
    | "60"
    | "56"
    | "52"
    | "48"
    | "44"
    | "40"
    | "36"
    | "32"
    | "28"
    | "24"
    | "20"
    | "16"
    | "14"
    | "12"
    | "11"
    | "10"
    | "9"
    | "8"
    | "7"
    | "6"
    | "5"
    | "4"
    | "3.5"
    | "3"
    | "2.5"
    | "2"
    | "1.5"
    | "1"
    | "0.5"
    | "0"
    | "px"
    | TailwindArbitrary
type TailwindGap = `gap-${GapVariants}`
export type TailwindGapType = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gap: TailwindGap
}

type TailwindGapX = `gap-x-${GapVariants}`
export type TailwindGapXType = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at x axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapX: TailwindGapX
}

type TailwindGapY = `gap-y-${GapVariants}`
export type TailwindGapYType = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at y axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapY: TailwindGapY
}
