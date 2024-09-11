import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindAspectRatioVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "square"
    | "video"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindAspectRatio<Plug extends PlugBase = ""> =
    `aspect-${TailwindAspectRatioVariants<Plug>}`

export type TailwindAspectRatioType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the aspect ratio of an element.
     *@see {@link https://tailwindcss.com/docs/aspect-ratio aspect ratio}
     */
    aspectRatio: TailwindAspectRatio<Plug>
}
