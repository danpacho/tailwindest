import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBrightnessVariants<Plug extends PlugBase = ""> =
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

type TailwindBrightness<Plug extends PlugBase = ""> =
    `brightness-${TailwindBrightnessVariants<Plug>}`
export type TailwindBrightnessType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying brightness filters to an element.
     *@see {@link https://tailwindcss.com/docs/brightness brightness}
     */
    filterBrightness: TailwindBrightness<Plug>
}

type TailwindBackdropBrightness<Plug extends PlugBase = ""> =
    `backdrop-brightness-${TailwindBrightnessVariants<Plug>}`
export type TailwindBackdropBrightnessType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop brightness filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-brightness backdrop brightness}
     */
    backdropBrightness: TailwindBackdropBrightness<Plug>
}
