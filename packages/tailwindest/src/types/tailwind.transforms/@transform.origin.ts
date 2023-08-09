import { PlugBase, Pluggable, PluginVariants } from "../plugin"
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

export type TailwindTransformOriginType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for specifying the origin for an element's transformations.
     *@see {@link https://tailwindcss.com/docs/transform-origin transform origin}
     */
    transformOrigin: PluginVariants<
        "origin",
        TailwindTransformOriginVariants<Plug>
    >
}
