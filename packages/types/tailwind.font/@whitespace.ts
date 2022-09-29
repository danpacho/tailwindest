type TailwindWhitespaceVariants =
    | "normal"
    | "nowrap"
    | "pre"
    | "pre-line"
    | "pre-wrap"
type TailwindWhitespace = `whitespace-${TailwindWhitespaceVariants}`
export type TailwindWhitespaceType = {
    /**
     *@note Utilities for controlling an element's white-space property.
     *@docs [whitespace](https://tailwindcss.com/docs/whitespace)
     */
    whitespace: TailwindWhitespace
}
