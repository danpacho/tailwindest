type TailwindTextOverflowVariants = "clip" | "ellipsis"
type TailwindTextOverflow = `text-${TailwindTextOverflowVariants}` | "truncate"
export type TailwindTextOverflowType = {
    /**
     *@note Utilities for controlling text overflow in an element.
     *@docs [text-overflow](https://tailwindcss.com/docs/text-overflow)
     */
    textOverflow: TailwindTextOverflow
}
