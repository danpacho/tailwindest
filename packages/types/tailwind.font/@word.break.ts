type TailwindWordBreakVariants = "normal" | "words" | "all"
type TailwindWordBreak = `break-${TailwindWordBreakVariants}`
export type TailwindWordBreakType = {
    /**
     *@note Utilities for controlling word breaks in an element.
     *@docs [work-break](https://tailwindcss.com/docs/work-break)
     */
    wordBreak: TailwindWordBreak
}
