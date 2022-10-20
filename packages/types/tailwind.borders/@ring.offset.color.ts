import { PlugBase, Pluggable } from "../plugin"

export type TailwindRingOffsetColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for setting the color of outline ring offsets.
     *@docs [ring-offset-color](https://tailwindcss.com/docs/ring-offset-color)
     */
    ringOffsetColor: `ring-offset-${TailwindColor | Pluggable<Plug>}`
}
