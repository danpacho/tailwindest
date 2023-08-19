type TailwindTextOverflowVariants = "clip" | "ellipsis"
type TailwindTextOverflow = `text-${TailwindTextOverflowVariants}` | "truncate"
export type TailwindTextOverflowType = {
    /**
     *@description Utilities for controlling text overflow in an element.
     *@see {@link https://tailwindcss.com/docs/text-overflow text overflow}
     */
    textOverflow: TailwindTextOverflow
}
