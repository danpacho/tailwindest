type TailwindOverflowVariants =
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
type TailwindOverflow = `overflow-${TailwindOverflowVariants}`
export type TailwindOverflowType = {
    /**
     *@description Utilities for controlling how an element handles content that is too large for the container.
     *@see {@link https://tailwindcss.com/docs/overflow overflow}
     */
    overflow: TailwindOverflow
}
