import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextIndentType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the amount of empty space shown before text in a block.
     *@docs [text-indent](https://tailwindcss.com/docs/text-indent)
     */
    textIndent: `indent-${TailwindSpacing | Pluggable<Plug>}`
}
