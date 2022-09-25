type TailwindClearVarients = "left" | "right" | "both" | "none"
type TailwindClear = `clear-${TailwindClearVarients}`
export type TailwindClearType = {
    /**
     *@note Utilities for controlling the wrapping of content around an element.
     *@docs [clear](https://tailwindcss.com/docs/clear)
     */
    clear: TailwindClear
}
