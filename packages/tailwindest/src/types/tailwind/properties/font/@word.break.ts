type TailwindWordBreakVariants = "normal" | "words" | "all"
type TailwindWordBreak = `break-${TailwindWordBreakVariants}`
export type TailwindWordBreakType = {
    /**
     *@description Utilities for controlling word breaks in an element.
     *@see {@link https://tailwindcss.com/docs/word-break word break}
     */
    wordBreak: TailwindWordBreak
}
