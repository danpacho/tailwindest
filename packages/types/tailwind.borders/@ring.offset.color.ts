import { TailwindColor } from "../tailwind.common/@color"

type TailwindRingOffsetColor = `ring-offset-${TailwindColor}`
export type TailwindRingOffsetColorType = {
    /**
     *@note Utilities for setting the color of outline ring offsets.
     *@docs [ring-offset-color](https://tailwindcss.com/docs/ring-offset-color)
     */
    ringOffsetColor: TailwindRingOffsetColor
}
