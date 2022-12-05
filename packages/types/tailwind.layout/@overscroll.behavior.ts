type TailwindOverscrollBehaviorVariants =
    | "auto"
    | "contain"
    | "none"
    | "y-auto"
    | "y-contain"
    | "y-none"
    | "x-auto"
    | "x-contain"
    | "x-none"

type TailwindOverscrollBehavior =
    `overscroll-${TailwindOverscrollBehaviorVariants}`
export type TailwindOverscrollBehaviorType = {
    /**
     *@description Utilities for controlling how the browser behaves when reaching the boundary of a scrolling area.
     *@see {@link https://tailwindcss.com/docs/overscroll-behavior overscroll behavior}
     */
    overscrollBehavior: TailwindOverscrollBehavior
}
