type TailwindTextAlignVariants =
    | "left"
    | "center"
    | "right"
    | "justify"
    | "start"
    | "end"
type TailwindTextAlign = `text-${TailwindTextAlignVariants}`
export type TailwindTextAlignType = {
    /**
     *@note Utilities for controlling the alignment of text.
     *@docs [text-align](https://tailwindcss.com/docs/text-align)
     */
    textAlign: TailwindTextAlign
}
