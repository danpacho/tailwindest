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
     *@description Utilities for controlling the alignment of text.
     *@see {@link https://tailwindcss.com/docs/text-align text align}
     */
    textAlign: TailwindTextAlign
}
