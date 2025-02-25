import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindCursorVariants<Plug extends PlugBase = ""> =
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
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindCursor<Plug extends PlugBase = ""> =
    `cursor-${TailwindCursorVariants<Plug>}`
export type TailwindCursorType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the cursor style when hovering over an element.
     *@see {@link https://tailwindcss.com/docs/cursor cursor}
     */
    cursor: TailwindCursor<Plug>
}
