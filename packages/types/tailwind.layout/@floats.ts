type TailwindFloatsVarients = "right" | "left" | "none"
type TailwindFloats = `float-${TailwindFloatsVarients}`
export type TailwindFloatsType = {
    /**
     *@note Utilities for controlling the wrapping of content around an element.
     *@docs [float](https://tailwindcss.com/docs/float)
     */
    float: TailwindFloats
}
