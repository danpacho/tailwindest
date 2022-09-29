import { TailwindColor } from "../tailwind.common/@color"

type TailwindTextColor = `text-${TailwindColor}`
export type TailwindTextColorType = {
    /**
     *@note Utilities for controlling the text color of an element.
     *@docs [text-color](https://tailwindcss.com/docs/text-color)
     */
    color: TailwindTextColor
}
