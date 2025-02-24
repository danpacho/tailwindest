import { PlugBase, Pluggable } from "../../../plugin"

export type TailwindRingOffsetColorType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the color of outline ring offsets.
     *@see {@link https://tailwindcss.com/docs/ring-offset-color ring offset color}
     */
    ringOffsetColor: `ring-offset-${TailwindColor | Pluggable<Plug>}`
}
