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
     *@description Utilities for controlling how strictly snap points are enforced in a snap container.
     *@see {@link https://tailwindcss.com/docs/scroll-snap-type scroll snap type}
     */
    scrollSnapType: TailwindScrollSnapType
}
