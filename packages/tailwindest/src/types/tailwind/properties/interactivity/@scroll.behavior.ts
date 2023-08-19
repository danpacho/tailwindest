type TailwindScrollBehaviorVariants = "auto" | "smooth"
type TailwindScrollBehavior = `scroll-${TailwindScrollBehaviorVariants}`
export type TailwindScrollBehaviorType = {
    /**
     *@description Utilities for controlling the scroll behavior of an element.
     *@see {@link https://tailwindcss.com/docs/scroll-behavior scroll behavior}
     */
    scrollBehavior: TailwindScrollBehavior
}
