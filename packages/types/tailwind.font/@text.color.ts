import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the text color of an element.
     *@docs [text-color](https://tailwindcss.com/docs/text-color)
     */
    color: `text-${TailwindColor | Pluggable<Plug>}`
}
