import { PlugBase, Pluggable } from "../plugin"

export type TailwindBoxShadowColorType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for controlling the color of a box shadow.
     *@see {@link https://tailwindcss.com/docs/box-shadow-color box shadow color}
     */
    boxShadowColor: `shadow-${TailwindColor | Pluggable<Plug>}`
}
