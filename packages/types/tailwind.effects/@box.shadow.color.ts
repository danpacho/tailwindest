import { TailwindColor } from "../tailwind.common/@color"

type TailwindBoxShadowColor = `shadow-${TailwindColor}`
export type TailwindBoxShadowColorType = {
    /**
     *@note Utilities for controlling the color of a box shadow.
     *@docs [box-shadow-color](https://tailwindcss.com/docs/box-shadow-color)
     */
    boxShadowColor: TailwindBoxShadowColor
}
