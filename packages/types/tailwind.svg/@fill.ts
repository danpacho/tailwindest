import { TailwindColor } from "../tailwind.common/@color"

type TailwindFill = `fill-${TailwindColor}`
export type TailwindFillType = {
    /**
     *@note Utilities for styling the fill of SVG elements.
     *@docs [fill](https://tailwindcss.com/docs/fill)
     */
    fill: TailwindFill
}
