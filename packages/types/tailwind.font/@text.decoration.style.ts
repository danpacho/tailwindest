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
     *@description Utilities for controlling the style of text decorations.
     *@see {@link https://tailwindcss.com/docs/text-decoration-style text decoration style}
     */
    textDecorationStyle: TailwindTextDecorationStyle
}
