type TailwindScrollSnapStopVariants = "normal" | "always"
type TailwindScrollSnapStop = `snap-${TailwindScrollSnapStopVariants}`
export type TailwindScrollSnapStopType = {
    /**
     *@description Utilities for controlling whether you can skip past possible snap positions.
     *@see {@link https://tailwindcss.com/docs/scroll-snap-stop scroll snap stop}
     */
    scrollSnapStop: TailwindScrollSnapStop
}
