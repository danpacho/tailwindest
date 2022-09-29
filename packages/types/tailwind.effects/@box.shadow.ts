type TailwindBoxShadowVariants = "sm" | "md" | "xl" | "2xl" | "inner" | "none"
type TailwindBoxShadow = "shadow" | `shadow-${TailwindBoxShadowVariants}`
export type TailwindBoxShadowType = {
    /**
     *@note Utilities for controlling the box shadow of an element.
     *@docs [box-shadow](https://tailwindcss.com/docs/box-shadow)
     */
    boxShadow: TailwindBoxShadow
}
