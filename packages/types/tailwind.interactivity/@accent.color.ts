import { PlugBase, Pluggable } from "../plugin"

export type TailwindAccentColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the accented color of a form control.
     *@docs [accent-color](https://tailwindcss.com/docs/accent-color)
     */
    accentColor: `accent-${TailwindColor | Pluggable<Plug>}`
}
