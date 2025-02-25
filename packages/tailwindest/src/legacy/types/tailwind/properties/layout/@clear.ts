type TailwindClearVariants = "left" | "right" | "both" | "none"
type TailwindClear = `clear-${TailwindClearVariants}`
export type TailwindClearType = {
    /**
     *@description Utilities for controlling the wrapping of content around an element.
     *@see {@link https://tailwindcss.com/docs/clear clear}
     */
    clear: TailwindClear
}
