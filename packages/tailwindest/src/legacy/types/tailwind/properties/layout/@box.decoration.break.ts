type TailwindBoxDecorationBreakVariants = "clone" | "slice"
type TailwindBoxDecorationBreak =
    `box-decoration-${TailwindBoxDecorationBreakVariants}`
export type TailwindBoxDecorationBreakType = {
    /**
     *@description Utilities for controlling how element fragments should be rendered across multiple lines, columns, or pages.
     *@see {@link https://tailwindcss.com/docs/box-decoration-break box decoration break}
     */
    boxDecoration: TailwindBoxDecorationBreak
}
