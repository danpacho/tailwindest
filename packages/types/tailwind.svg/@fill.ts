import { PlugBase, Pluggable } from "../plugin"

export type TailwindFillType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for styling the fill of SVG elements.
     *@docs [fill](https://tailwindcss.com/docs/fill)
     */
    fill: `fill-${TailwindColor | Pluggable<Plug>}`
}
