type TailwindScrollBehaviorVariants = "auto" | "smooth"
type TailwindScrollBehavior = `scroll-${TailwindScrollBehaviorVariants}`
export type TailwindScrollBehaviorType = {
    /**
     *@note Utilities for controlling the scroll behavior of an element.
     *@docs [scroll-behavior](https://tailwindcss.com/docs/scroll-behavior)
     */
    scrollBehavior: TailwindScrollBehavior
}
