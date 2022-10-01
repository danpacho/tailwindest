type TailwindScrollSnapStopVariants = "normal" | "always"
type TailwindScrollSnapStop = `snap-${TailwindScrollSnapStopVariants}`
export type TailwindScrollSnapStopType = {
    /**
     *@note Utilities for controlling whether you can skip past possible snap positions.
     *@docs [scroll-snap-stop](https://tailwindcss.com/docs/scroll-snap-stop)
     */
    scrollSnapStop: TailwindScrollSnapStop
}
