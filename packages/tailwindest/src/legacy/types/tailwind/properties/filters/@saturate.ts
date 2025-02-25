import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindSaturateVariants<Plug extends PlugBase = ""> =
    | "0"
    | "50"
    | "100"
    | "150"
    | "200"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindSaturate<Plug extends PlugBase = ""> =
    `saturate-${TailwindSaturateVariants<Plug>}`
export type TailwindSaturateType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying saturation filters to an element.
     *@see {@link https://tailwindcss.com/docs/saturate saturate}
     */
    filterSaturate: TailwindSaturate<Plug>
}

type TailwindBackdropSaturate<Plug extends PlugBase = ""> =
    `backdrop-saturate-${TailwindSaturateVariants<Plug>}`
export type TailwindBackdropSaturateType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop saturation filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-saturate backdrop saturate}
     */
    backdropSaturate: TailwindBackdropSaturate<Plug>
}
