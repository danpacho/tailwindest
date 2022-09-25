type TailwindOverflowVarients =
    | "auto"
    | "hidden"
    | "clip"
    | "visible"
    | "scroll"
    | "x-auto"
    | "y-auto"
    | "x-hidden"
    | "y-hidden"
    | "x-clip"
    | "y-clip"
    | "x-visible"
    | "y-visible"
    | "x-scroll"
    | "y-scroll"
type TailwindOverflow = `overflow-${TailwindOverflowVarients}`
export type TailwindOverflowType = {
    /**
     *@note Utilities for controlling how an element handles content that is too large for the container.
     *@docs [overflow](https://tailwindcss.com/docs/overflow)
     */
    overflow: TailwindOverflow
}
