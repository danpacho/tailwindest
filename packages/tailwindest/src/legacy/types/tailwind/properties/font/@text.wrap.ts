type TailwindTextWrap = "wrap" | "nowrap" | "balance" | "pretty"
export type TailwindTextWrapType = {
    /**
     *@description Utilities for controlling how text wraps within an element.
     *@see {@link https://tailwindcss.com/docs/text-wrap text wrap}
     */
    textWrap: `text-${TailwindTextWrap}`
}
