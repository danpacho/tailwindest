import { PlugBase, Pluggable } from "../plugin"

export type TailwindBoxShadowColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color of a box shadow.
     *@docs [box-shadow-color](https://tailwindcss.com/docs/box-shadow-color)
     */
    boxShadowColor: `shadow-${TailwindColor | Pluggable<Plug>}`
}
