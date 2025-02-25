import { PlugBase, Pluggable } from "../../../plugin"

export type TailwindFillType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for styling the fill of SVG elements.
     *@see {@link https://tailwindcss.com/docs/fill fill}
     */
    fill: `fill-${TailwindColor | Pluggable<Plug>}`
}
