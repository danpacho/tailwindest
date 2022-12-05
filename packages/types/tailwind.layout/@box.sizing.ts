type TailwindBoxSizingVariants = "border" | "content"
type TailwindBoxSizing = `box-${TailwindBoxSizingVariants}`
export type TailwindBoxSizingType = {
    /**
     *@description Utilities for controlling how the browser should calculate an element's total size.
     *@see {@link https://tailwindcss.com/docs/box-sizing box sizing}
     */
    boxSizing: TailwindBoxSizing
}
