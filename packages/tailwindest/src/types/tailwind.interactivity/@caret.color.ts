import { PlugBase, Pluggable } from "../plugin"

export type TailwindCaretColorType<
    TailwindColor extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for controlling the color of the text input cursor.
     *@see {@link https://tailwindcss.com/docs/caret-color caret color}
     */
    caretColor: `caret-${TailwindColor | Pluggable<Plug>}`
}
