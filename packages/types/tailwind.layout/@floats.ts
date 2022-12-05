type TailwindFloatsVariants = "right" | "left" | "none"
type TailwindFloats = `float-${TailwindFloatsVariants}`
export type TailwindFloatsType = {
    /**
     *@description Utilities for controlling the wrapping of content around an element.
     *@see {@link https://tailwindcss.com/docs/float float}
     */
    float: TailwindFloats
}
