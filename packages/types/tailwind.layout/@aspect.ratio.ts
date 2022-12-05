import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindAsepectRatio<Plug extends PlugBase = ""> =
    | "aspect-auto"
    | "aspect-square"
    | "aspect-video"
    | Pluggable<Plug>
    | TailwindArbitrary

export type TailwindAsepectRatioType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the aspect ratio of an element.
     *@see {@link https://tailwindcss.com/docs/aspect-ratio aspect ratio}
     */
    aspectRatio: TailwindAsepectRatio<Plug>
}
