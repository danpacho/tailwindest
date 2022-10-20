import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBlurVariants<Plug extends PlugBase = ""> = Pluggable<
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | Plug
    | TailwindArbitrary
>
type TailwindBlur<Plug extends PlugBase = ""> =
    | "blur"
    | `blur-${TailwindBlurVariants<Plug>}`

export type TailwindBlurType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying blur filters to an element.
     *@docs [blur](https://tailwindcss.com/docs/blur)
     */
    filterBlur: TailwindBlur<Plug>
}

type TailwindBackdropBlur<Plug extends PlugBase = ""> =
    `backdrop-blur-${TailwindBlurVariants<Plug>}`
export type TailwindBackdropBlurType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for applying backdrop blur filters to an element.
     *@docs [backdrop-blur](https://tailwindcss.com/docs/backdrop-blur)
     */
    backdropBlur: TailwindBackdropBlur<Plug>
}
