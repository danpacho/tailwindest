import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBackdropOpacityVariants =
    | "0"
    | "5"
    | "10"
    | "20"
    | "25"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "75"
    | "80"
    | "90"
    | "95"
    | "100"
    | TailwindArbitrary
type TailwindBackdropOpacity =
    `backdrop-opacity-${TailwindBackdropOpacityVariants}`
export type TailwindBackdropOpacityType = {
    /**
     *@note Utilities for applying backdrop opacity filters to an element.
     *@docs [backdrop-opacity](https://tailwindcss.com/docs/backdrop-opacity)
     */
    backdropOpacity: TailwindBackdropOpacity
}
