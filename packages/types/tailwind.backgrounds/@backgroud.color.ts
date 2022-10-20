import { PlugBase, Pluggable } from "../plugin"

export type TailwindBackgroundColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling an element's background color.
     *@docs [background-color](https://tailwindcss.com/docs/background-color)
     */
    backgroundColor: `bg-${TailwindColor | Pluggable<Plug>}`
}
