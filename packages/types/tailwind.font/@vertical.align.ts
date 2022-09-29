type TailwindVerticalAlignVariants =
    | "baseline"
    | "top"
    | "middle"
    | "bottom"
    | "text-top"
    | "text-bottom"
    | "sub"
    | "super"
type TailwindVerticalAlign = `align-${TailwindVerticalAlignVariants}`
export type TailwindVerticalAlignType = {
    /**
     *@note Utilities for controlling the vertical alignment of an inline or table-cell box.
     *@docs [vertical-align](https://tailwindcss.com/docs/vertical-align)
     */
    verticalAlign: TailwindVerticalAlign
}
