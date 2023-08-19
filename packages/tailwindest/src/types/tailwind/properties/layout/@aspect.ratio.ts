import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindAspectRatio<Plug extends PlugBase = ""> =
    | "aspect-auto"
    | "aspect-square"
    | "aspect-video"
    | Pluggable<Plug>
    | TailwindArbitrary

export type TailwindAspectRatioType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the aspect ratio of an element.
     *@see {@link https://tailwindcss.com/docs/aspect-ratio aspect ratio}
     */
    aspectRatio: TailwindAspectRatio<Plug>
}
