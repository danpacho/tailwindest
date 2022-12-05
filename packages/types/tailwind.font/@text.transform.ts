type TailwindTextTransform =
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "normal-case"
export type TailwindTextTransformType = {
    /**
     *@description Utilities for controlling the transformation of text.
     *@see {@link https://tailwindcss.com/docs/text-transform text transform}
     */
    textTransform: TailwindTextTransform
}
