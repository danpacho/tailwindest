import { TailwindColor } from "../tailwind.common/@color"

type TailwindCaretColor = `caret-${TailwindColor}`
export type TailwindCaretColorType = {
    /**
     *@note Utilities for controlling the color of the text input cursor.
     *@docs [caret-color](https://tailwindcss.com/docs/caret-color)
     */
    caretColor: TailwindCaretColor
}
