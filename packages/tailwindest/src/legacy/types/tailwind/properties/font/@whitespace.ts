type TailwindWhitespaceVariants =
    | "normal"
    | "nowrap"
    | "pre"
    | "pre-line"
    | "pre-wrap"
type TailwindWhitespace = `whitespace-${TailwindWhitespaceVariants}`
export type TailwindWhitespaceType = {
    /**
     *@description Utilities for controlling an element's white-space property.
     *@see {@link https://tailwindcss.com/docs/whitespace whitespace}
     */
    whitespace: TailwindWhitespace
}
