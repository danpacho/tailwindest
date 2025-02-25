import { PlugBase, Pluggable } from "../../../../plugin"

export type ShortTailwindBackgroundColorType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for controlling an element's background color.
     *@see {@link https://tailwindcss.com/docs/background-color background color}
     */
    bg: `bg-${TailwindColor | Pluggable<Plug>}`
}
