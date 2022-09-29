type TailwindTextTransformVariants =
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "normal-case"
type TailwindTextTransform = `-${TailwindTextTransformVariants}`
export type TailwindTextTransformType = {
    /**
     *@note Utilities for controlling the transformation of text.
     *@docs [text-transform](https://tailwindcss.com/docs/text-transform)
     */
    textTransform: TailwindTextTransform
}
