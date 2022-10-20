import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindInvertVariants<Plug extends PlugBase = ""> = Pluggable<
    "0" | Plug | TailwindArbitrary
>

type TailwindInvert<Plug extends PlugBase = ""> =
    | "invert"
    | `invert-${TailwindInvertVariants<Plug>}`
export type TailwindInvertType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying invert filters to an element.
     *@docs [invert](https://tailwindcss.com/docs/invert)
     */
    filterInvert: TailwindInvert<Plug>
}

type TailwindBackdropInvert<Plug extends PlugBase = ""> =
    | "backdrop-invert"
    | `backdrop-invert-${TailwindInvertVariants<Plug>}`
export type TailwindBackdropInvertType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying backdrop invert filters to an element.
     *@docs [backdrop-invert](https://tailwindcss.com/docs/backdrop-invert)
     */
    backdropInvert: TailwindBackdropInvert<Plug>
}
