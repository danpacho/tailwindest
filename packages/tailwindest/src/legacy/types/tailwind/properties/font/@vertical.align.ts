import type { TailwindArbitrary } from "../common/@arbitrary"

type TailwindVerticalAlignVariants =
    | "baseline"
    | "top"
    | "middle"
    | "bottom"
    | "text-top"
    | "text-bottom"
    | "sub"
    | "super"
    | TailwindArbitrary
type TailwindVerticalAlign = `align-${TailwindVerticalAlignVariants}`
export type TailwindVerticalAlignType = {
    /**
     *@description Utilities for controlling the vertical alignment of an inline or table-cell box.
     *@see {@link https://tailwindcss.com/docs/vertical-align vertical align}
     */
    verticalAlign: TailwindVerticalAlign
}
