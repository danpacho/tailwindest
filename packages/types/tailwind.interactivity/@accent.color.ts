import { TailwindColor } from "../tailwind.common/@color"

type TailwindAccentColor = `accent-${TailwindColor}`
export type TailwindAccentColorType = {
    /**
     *@note Utilities for controlling the accented color of a form control.
     *@docs [accent-color](https://tailwindcss.com/docs/accent-color)
     */
    accentColor: TailwindAccentColor
}
