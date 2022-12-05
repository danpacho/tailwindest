import { PlugBase, Pluggable } from "../plugin"

export type TailwindOutlineColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the color of an element's outline.
     *@see {@link https://tailwindcss.com/docs/outline-color outline color}
     */
    outlineColor: `outline-${TailwindColor | Pluggable<Plug>}`
}
