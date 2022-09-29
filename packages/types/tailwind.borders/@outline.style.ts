import { TailwindBorderStyleVariants } from "./@border.style"

type TailwindOutlineStyle = "outline" | `outline-${TailwindBorderStyleVariants}`
export type TailwindOutlineStyleType = {
    /**
     *@note Utilities for controlling the style of an element's outline.
     *@docs [outline-style](https://tailwindcss.com/docs/outline-style)
     */
    outlineStyle: TailwindOutlineStyle
}
