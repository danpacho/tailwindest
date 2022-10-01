import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindStrokeWidthVariants = "0" | "1" | "2" | TailwindArbitrary
type TailwindStrokeWidth = `stroke-${TailwindStrokeWidthVariants}`
export type TailwindStrokeWidthType = {
    /**
     *@note Utilities for styling the stroke width of SVG elements.
     *@docs [stroke-width](https://tailwindcss.com/docs/stroke-width)
     */
    strokeWidth: TailwindStrokeWidth
}
