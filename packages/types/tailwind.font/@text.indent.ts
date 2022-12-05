import { PlugBase, Pluggable } from "../plugin"

export type TailwindTextIndentType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the amount of empty space shown before text in a block.
     *@see {@link https://tailwindcss.com/docs/text-indent text indent}
     */
    textIndent: `indent-${TailwindSpacing | Pluggable<Plug>}`
}
