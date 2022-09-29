type TailwindBoxDecorationBreakVariants = "clone" | "slice"
type TailwindBoxDecorationBreak =
    `box-decoration-${TailwindBoxDecorationBreakVariants}`
export type TailwindBoxDecorationBreakType = {
    /**
     *@note Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.
     *@docs [box-decoration-break](https://tailwindcss.com/docs/box-decoration-break)
     */
    boxDecoration: TailwindBoxDecorationBreak
}
