type TailwindScrollSnapAlignVariants = "start" | "center" | "end" | "align-none"
type TailwindScrollSnapAlign = `snap-${TailwindScrollSnapAlignVariants}`
export type TailwindScrollSnapAlignType = {
    /**
     *@note Utilities for controlling the scroll snap alignment of an element.
     *@docs [scroll-snap-align](https://tailwindcss.com/docs/scroll-snap-align)
     */
    scrollSnapAlign: TailwindScrollSnapAlign
}
