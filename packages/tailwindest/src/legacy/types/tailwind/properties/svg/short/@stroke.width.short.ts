import { PlugBase, Pluggable } from "../../../../plugin"
import { TailwindArbitrary } from "../../common/@arbitrary"

type TailwindStrokeWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindStrokeWidth<Plug extends PlugBase = ""> =
    `stroke-${TailwindStrokeWidthVariants<Plug>}`
export type ShortTailwindStrokeWidthType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for styling the stroke width of SVG elements.
     *@see {@link https://tailwindcss.com/docs/stroke-width stroke width}
     */
    strokeW: TailwindStrokeWidth<Plug>
}
