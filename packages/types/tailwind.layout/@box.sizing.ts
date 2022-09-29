type TailwindBoxSizingVariants = "border" | "content"
type TailwindBoxSizing = `box-${TailwindBoxSizingVariants}`
export type TailwindBoxSizingType = {
    /**
     *@note Utilities for controlling how the browser should calculate an element's total size.
     *@docs [box-sizing](https://tailwindcss.com/docs/box-sizing)
     */
    boxSizing: TailwindBoxSizing
}
