import { PlugBase, Pluggable } from "../plugin"

export type TailwindOutlineColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color of an element's outline.
     *@docs [outline-color](https://tailwindcss.com/docs/outline-color)
     */
    outlineColor: `outline-${TailwindColor | Pluggable<Plug>}`
}
