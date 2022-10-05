type TailwindTextTransform =
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "normal-case"
export type TailwindTextTransformType = {
    /**
     *@note Utilities for controlling the transformation of text.
     *@docs [text-transform](https://tailwindcss.com/docs/text-transform)
     */
    textTransform: TailwindTextTransform
}
