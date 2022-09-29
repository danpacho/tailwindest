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
     *@note Utilities for controlling how the browser behaves when reaching the boundary of a scrolling area.
     *@docs [overscroll-behavior](https://tailwindcss.com/docs/overscroll-behavior)
     */
    overscrollBehavior: TailwindOverscrollBehavior
}
