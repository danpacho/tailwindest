import { TailwindColor } from "../tailwind.common/@color"

type TailwindOutlineColor = `outline-${TailwindColor}`
export type TailwindOutlineColorType = {
    /**
     *@note Utilities for controlling the color of an element's outline.
     *@docs [outline-color](https://tailwindcss.com/docs/outline-color)
     */
    outlineColor: TailwindOutlineColor
}
