import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBrigtnessVariants<Plug extends PlugBase = ""> =
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
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindBrigtness<Plug extends PlugBase = ""> =
    `brightness-${TailwindBrigtnessVariants<Plug>}`
export type TailwindBrigtnessType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying brightness filters to an element.
     *@docs [brightness](https://tailwindcss.com/docs/)
     */
    filterBrigthness: TailwindBrigtness<Plug>
}

type TailwindBackdropBrigthness<Plug extends PlugBase = ""> =
    `backdrop-brigthness-${TailwindBrigtnessVariants<Plug>}`
export type TailwindBackdropBrigthnessType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying backdrop brightness filters to an element.
     *@docs [backdrop-brigthness](https://tailwindcss.com/docs/backdrop-brigthness)
     */
    backdropBrightness: TailwindBackdropBrigthness<Plug>
}
