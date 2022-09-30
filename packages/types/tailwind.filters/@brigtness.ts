import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBrigtnessVariants =
    | "0"
    | "50"
    | "75"
    | "90"
    | "95"
    | "100"
    | "105"
    | "110"
    | "125"
    | "150"
    | "200"
    | TailwindArbitrary
type TailwindBrigtness = `brightness-${TailwindBrigtnessVariants}`
export type TailwindBrigtnessType = {
    /**
     *@note Utilities for applying brightness filters to an element.
     *@docs [brightness](https://tailwindcss.com/docs/)
     */
    filterBrigthness: TailwindBrigtness
}

type TailwindBackdropBrigthness =
    `backdrop-brigthness-${TailwindBrigtnessVariants}`
export type TailwindBackdropBrigthnessType = {
    /**
     *@note Utilities for applying backdrop brightness filters to an element.
     *@docs [backdrop-brigthness](https://tailwindcss.com/docs/backdrop-brigthness)
     */
    backdropBrightness: TailwindBackdropBrigthness
}
