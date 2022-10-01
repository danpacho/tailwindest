type TailwindWillChangeVariants = "auto" | "scroll" | "contents" | "transform"
type TailwindWillChange = `will-change-${TailwindWillChangeVariants}`
export type TailwindWillChangeType = {
    /**
     *@note Utilities for optimizing upcoming animations of elements that are expected to change.
     *@docs [will-change](https://tailwindcss.com/docs/will-change)
     */
    willChange: TailwindWillChange
}
