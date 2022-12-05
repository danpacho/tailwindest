import { TailwindBorderStyleVariants } from "./@border.style"

type TailwindOutlineStyle = "outline" | `outline-${TailwindBorderStyleVariants}`
export type TailwindOutlineStyleType = {
    /**
     *@description Utilities for controlling the style of an element's outline.
     *@see {@link https://tailwindcss.com/docs/outline-style outline style}
     */
    outlineStyle: TailwindOutlineStyle
}
