import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindCursorVariants =
    | "auto"
    | "default"
    | "pointer"
    | "wait"
    | "text"
    | "move"
    | "help"
    | "not-allowed"
    | "none"
    | "context-menu"
    | "progress"
    | "cell"
    | "crosshair"
    | "vertical-text"
    | "alias"
    | "copy"
    | "no-drop"
    | "grab"
    | "grabbing"
    | "all-scroll"
    | "col-resize"
    | "row-resize"
    | "n-resize"
    | "e-resize"
    | "s-resize"
    | "w-resize"
    | "ne-resize"
    | "nw-resize"
    | "se-resize"
    | "sw-resize"
    | "ew-resize"
    | "ns-resize"
    | "nesw-resize"
    | "nwse-resize"
    | "zoom-in"
    | "zoom-out"
    | TailwindArbitrary
type TailwindCursor = `cursor-${TailwindCursorVariants}`
export type TailwindCursorType = {
    /**
     *@note Utilities for controlling the cursor style when hovering over an element.
     *@docs [cursor](https://tailwindcss.com/docs/cursor)
     */
    cursor: TailwindCursor
}
