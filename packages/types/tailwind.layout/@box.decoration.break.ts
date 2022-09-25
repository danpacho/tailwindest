type TailwindBoxDecorationBreakVarients = "clone" | "slice"
type TailwindBoxDecorationBreak =
    `box-decoration-${TailwindBoxDecorationBreakVarients}`
export type TailwindBoxDecorationBreakType = {
    /**
     *@note Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.
     *@docs [box-decoration-break](https://tailwindcss.com/docs/box-decoration-break)
     */
    boxDecoration: TailwindBoxDecorationBreak
}
