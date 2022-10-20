import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextDecorationColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color of text decorations.
     *@docs [text-decoration](https://tailwindcss.com/docs/text-decoration)
     */
    textDecorationColor: `decoration-${TailwindColor | Pluggable<Plug>}`
}
