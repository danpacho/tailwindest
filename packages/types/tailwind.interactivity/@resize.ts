type TailwindResizeVariants = "none" | "x" | "y"
type TailwindResize = "resize" | `resize-${TailwindResizeVariants}`
export type TailwindResizeType = {
    /**
     *@description Utilities for controlling how an element can be resized.
     *@see {@link https://tailwindcss.com/docs/resize resize}
     */
    resize: TailwindResize
}
