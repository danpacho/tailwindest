import { PlugBase, Pluggable } from "../plugin"

export type TailwindStrokeType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for styling the stroke of SVG elements.
     *@see {@link https://tailwindcss.com/docs/stroke stroke}
     */
    stroke: `stroke-${TailwindColor | Pluggable<Plug>}`
}
