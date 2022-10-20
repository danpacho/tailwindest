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
     *@note Utilities for controlling the aspect ratio of an element.
     *@docs [aspect-ratio](https://tailwindcss.com/docs/aspect-ratio)
     */
    aspectRatio: TailwindAsepectRatio<Plug>
}
