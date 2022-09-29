import { TailwindColor } from "../tailwind.common/@color"

type TailwindBackgroundColor = `bg-${TailwindColor}`
export type TailwindBackgroundColorType = {
    /**
     *@note Utilities for controlling an element's background color.
     *@docs [background-color](https://tailwindcss.com/docs/background-color)
     */
    backgroundColor: TailwindBackgroundColor
}
