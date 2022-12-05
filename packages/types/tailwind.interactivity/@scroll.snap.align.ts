type TailwindScrollSnapAlignVariants = "start" | "center" | "end" | "align-none"
type TailwindScrollSnapAlign = `snap-${TailwindScrollSnapAlignVariants}`
export type TailwindScrollSnapAlignType = {
    /**
     *@description Utilities for controlling the scroll snap alignment of an element.
     *@see {@link https://tailwindcss.com/docs/scroll-snap-align scroll snap align}
     */
    scrollSnapAlign: TailwindScrollSnapAlign
}
