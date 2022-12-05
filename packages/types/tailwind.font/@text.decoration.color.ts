import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextDecorationColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the color of text decorations.
     *@see {@link https://tailwindcss.com/docs/text-decoration text decoration}
     */
    textDecorationColor: `decoration-${TailwindColor | Pluggable<Plug>}`
}
