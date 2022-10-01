type TailwindResizeVariants = "none" | "x" | "y"
type TailwindResize = "resize" | `resize-${TailwindResizeVariants}`
export type TailwindResizeType = {
    /**
     *@note Utilities for controlling how an element can be resized.
     *@docs [resize](https://tailwindcss.com/docs/resize)
     */
    resize: TailwindResize
}
