type TailwindTextDecoration =
    | "underline"
    | "overline"
    | "line-through"
    | "no-underline"
export type TailwindTextDecorationType = {
    /**
     *@note Utilities for controlling the decoration of text.
     *@docs [text-decoration](https://tailwindcss.com/docs/text-decoration)
     */
    textDecorationLine: TailwindTextDecoration
}
