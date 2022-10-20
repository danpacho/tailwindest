import { PlugBase, Pluggable } from "../plugin"

export type TailwindCaretColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color of the text input cursor.
     *@docs [caret-color](https://tailwindcss.com/docs/caret-color)
     */
    caretColor: `caret-${TailwindColor | Pluggable<Plug>}`
}
