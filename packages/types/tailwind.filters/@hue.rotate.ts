import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindHueRotateVariants<Plug extends PlugBase = ""> =
    | "0"
    | "15"
    | "30"
    | "60"
    | "90"
    | "100"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindHueRotate<Plug extends PlugBase = ""> =
    | `hue-rotate-${TailwindHueRotateVariants<Plug>}`
    | `-hue-rotate-${TailwindHueRotateVariants<Plug>}`
export type TailwindHueRotateType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying hue-rotate filters to an element.
     *@docs [hue-rotate](https://tailwindcss.com/docs/hue-rotate)
     */
    filterHueRotate: TailwindHueRotate<Plug>
}

type TailwindBackdropHueRotate<Plug extends PlugBase = ""> =
    | `backdrop-hue-rotate-${TailwindHueRotateVariants<Plug>}`
    | `-backdrop-hue-rotate-${TailwindHueRotateVariants<Plug>}`
export type TailwindBackdropHueRotateType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying backdrop hue-rotate filters to an element.
     *@docs [backdrop-hue-rotate](https://tailwindcss.com/docs/backdrop-hue-rotate)
     */
    backdropHueRotate: TailwindBackdropHueRotate<Plug>
}
