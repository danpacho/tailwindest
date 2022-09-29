import { TailwindColor } from "../tailwind.common/@color"

type TailwindRingColor = `ring-${TailwindColor}`
export type TailwindRingColorType = {
    /**
     *@note Utilities for setting the color of outline rings.
     *@docs [ring-color](https://tailwindcss.com/docs/ring-color)
     */
    ringColor: TailwindRingColor
}
