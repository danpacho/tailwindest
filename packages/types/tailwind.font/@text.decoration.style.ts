type TailwindTextDecorationStyleVariants =
    | "solid"
    | "double"
    | "dotted"
    | "dashed"
    | "wavy"
type TailwindTextDecorationStyle =
    `decoration-${TailwindTextDecorationStyleVariants}`
export type TailwindTextDecorationStyleType = {
    /**
     *@note Utilities for controlling the style of text decorations.
     *@docs [texto-decoration-style](https://tailwindcss.com/docs/texto-decoration-style)
     */
    textDecorationStyle: TailwindTextDecorationStyle
}
