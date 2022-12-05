import { PlugBase, Pluggable } from "../plugin"

export type TailwindRingColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for setting the color of outline rings.
     *@see {@link https://tailwindcss.com/docs/ring-color ring color}
     */
    ringColor: `ring-${TailwindColor | Pluggable<Plug>}`
}
