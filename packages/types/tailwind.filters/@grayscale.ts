import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindGrayscaleVariants<Plug extends PlugBase = ""> = Pluggable<
    "0" | Plug | TailwindArbitrary
>

type TailwindGrayscale<Plug extends PlugBase = ""> =
    | "grayscale"
    | `grayscale-${TailwindGrayscaleVariants<Plug>}`
export type TailwindGrayscaleType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying grayscale filters to an element.
     *@see {@link https://tailwindcss.com/docs/grayscale grayscale}
     */
    filterGrayscale: TailwindGrayscale<Plug>
}

type TailwindBackdropGrayscale<Plug extends PlugBase = ""> =
    | "backdrop-grayscale"
    | `backdrop-grayscale-${TailwindGrayscaleVariants<Plug>}`
export type TailwindBackdropGrayscaleType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop grayscale filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-grayscale backdrop grayscale}
     */
    backdropGrayscale: TailwindBackdropGrayscale<Plug>
}
