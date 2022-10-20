import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransformOriginVariants<Plug extends PlugBase = ""> =
    | "center"
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindTransformOrigin<Plug extends PlugBase = ""> =
    `origin-${TailwindTransformOriginVariants<Plug>}`
export type TailwindTransformOriginType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for specifying the origin for an element's transformations.
     *@docs [transform-origin](https://tailwindcss.com/docs/transform-origin)
     */
    transformOrigin: TailwindTransformOrigin<Plug>
}
