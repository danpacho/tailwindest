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
     *@description Utilities for applying blur filters to an element.
     *@see {@link https://tailwindcss.com/docs/blur blur}
     */
    filterBlur: TailwindBlur<Plug>
}

type TailwindBackdropBlur<Plug extends PlugBase = ""> =
    `backdrop-blur-${TailwindBlurVariants<Plug>}`
export type TailwindBackdropBlurType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying backdrop blur filters to an element.
     *@see {@link https://tailwindcss.com/docs/backdrop-blur backdrop blur}
     */
    backdropBlur: TailwindBackdropBlur<Plug>
}
