type TailwindRingOffsetWidthVariants = "0" | "1" | "2" | "4" | "8"
type TailwindRingOffsetWidth = `ring-offset-${TailwindRingOffsetWidthVariants}`
export type TailwindRingWidthOffsetType = {
    /**
     *@note Utilities for simulating an offset when adding outline rings.
     *@docs [ring-offset-width](https://tailwindcss.com/docs/ring-offset-width)
     */
    ringOffsetWidth: TailwindRingOffsetWidth
}
