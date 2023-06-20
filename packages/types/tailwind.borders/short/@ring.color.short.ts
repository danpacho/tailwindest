import { PlugBase, Pluggable } from "../../plugin"

export type ShortTailwindRingColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for setting the color of outline rings.
     *@see {@link https://tailwindcss.com/docs/ring-color ring color}
     */
    ring: `ring-${TailwindColor | Pluggable<Plug>}`
}
