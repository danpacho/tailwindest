import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindStrokeWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindStrokeWidth<Plug extends PlugBase = ""> =
    `stroke-${TailwindStrokeWidthVariants<Plug>}`
export type TailwindStrokeWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for styling the stroke width of SVG elements.
     *@docs [stroke-width](https://tailwindcss.com/docs/stroke-width)
     */
    strokeWidth: TailwindStrokeWidth<Plug>
}
