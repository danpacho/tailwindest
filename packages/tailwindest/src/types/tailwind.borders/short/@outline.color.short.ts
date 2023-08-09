import { PlugBase, Pluggable } from "../../plugin"

export type ShortTailwindOutlineColorType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for controlling the color of an element's outline.
     *@see {@link https://tailwindcss.com/docs/outline-color outline color}
     */
    outline: `outline-${TailwindColor | Pluggable<Plug>}`
}
