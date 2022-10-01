import { TailwindColor } from "../tailwind.common/@color"

type TailwindStroke = `stroke-${TailwindColor}`
export type TailwindStrokeType = {
    /**
     *@note Utilities for styling the stroke of SVG elements.
     *@docs [stroke](https://tailwindcss.com/docs/stroke)
     */
    stroke: TailwindStroke
}
