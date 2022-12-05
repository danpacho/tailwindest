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
     *@description Utilities for applying brightness filters to an element.
     *@see {@link https://tailwindcss.com/docs/brightness brightness}
     */
    filterBrigthness: TailwindBrigtness<Plug>
}

type TailwindBackdropBrigthness<Plug extends PlugBase = ""> =
    `backdrop-brigthness-${TailwindBrigtnessVariants<Plug>}`
export type TailwindBackdropBrigthnessType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop brightness filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-brightness backdrop brightness}
     */
    backdropBrightness: TailwindBackdropBrigthness<Plug>
}
