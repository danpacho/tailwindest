import { PlugBase, Pluggable } from "../plugin"

export type TailwindBackgroundColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling an element's background color.
     *@see {@link https://tailwindcss.com/docs/background-color background color}
     */
    backgroundColor: `bg-${TailwindColor | Pluggable<Plug>}`
}
