import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindSepiaVariants<Plug extends PlugBase = ""> = Pluggable<
    "0" | Plug | TailwindArbitrary
>

type TailwindSepia<Plug extends PlugBase = ""> =
    | "sepia"
    | `sepia-${TailwindSepiaVariants<Plug>}`
export type TailwindSepiaType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying sepia filters to an element.
     *@docs [sepia](https://tailwindcss.com/docs/sepia)
     */
    filterSepia: TailwindSepia<Plug>
}

type TailwindBackdropSepia<Plug extends PlugBase = ""> =
    `backdrop-sepia-${TailwindSepiaVariants<Plug>}`
export type TailwindBackdropSepiaType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying backdrop sepia filters to an element.
     *@docs [backdrop-sepia](https://tailwindcss.com/docs/backdrop-sepia)
     */
    backdropSepia: TailwindBackdropSepia<Plug>
}
