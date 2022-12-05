import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the text color of an element.
     *@see {@link https://tailwindcss.com/docs/text-color text color}
     */
    color: `text-${TailwindColor | Pluggable<Plug>}`
}
