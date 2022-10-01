type TailwindScrollSnapTypeVariants =
    | "none"
    | "x"
    | "y"
    | "both"
    | "mandatory"
    | "proximity"
type TailwindScrollSnapType = `snap-${TailwindScrollSnapTypeVariants}`
export type TailwindScrollSnapTypeType = {
    /**
     *@note Utilities for controlling how strictly snap points are enforced in a snap container.
     *@docs [scroll-snap-type](https://tailwindcss.com/docs/scroll-snap-type)
     */
    scrollSnapType: TailwindScrollSnapType
}
