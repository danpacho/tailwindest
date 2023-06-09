import { PlugBase, Pluggable } from "../../plugin"

export type ShortTailwindRingOffsetColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for setting the color of outline ring offsets.
     *@see {@link https://tailwindcss.com/docs/ring-offset-color ring offset color}
     */
    ringOffset: `ring-offset-${TailwindColor | Pluggable<Plug>}`
}
