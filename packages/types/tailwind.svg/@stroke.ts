import { PlugBase, Pluggable } from "../plugin"

export type TailwindStrokeType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for styling the stroke of SVG elements.
     *@docs [stroke](https://tailwindcss.com/docs/stroke)
     */
    stroke: `stroke-${TailwindColor | Pluggable<Plug>}`
}
