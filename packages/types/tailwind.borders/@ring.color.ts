import { PlugBase, Pluggable } from "../plugin"

export type TailwindRingColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for setting the color of outline rings.
     *@docs [ring-color](https://tailwindcss.com/docs/ring-color)
     */
    ringColor: `ring-${TailwindColor | Pluggable<Plug>}`
}
