type TailwindDropShadowVariants = "sm" | "md" | "lg" | "xl" | "2xl" | "none"
type TailwindDropShadow =
    | "drop-shadow"
    | `drop-shadow-${TailwindDropShadowVariants}`
export type TailwindDropShadowType = {
    /**
     *@note Utilities for applying drop-shadow filters to an element.
     *@docs [drop-shadow](https://tailwindcss.com/docs/drop-shadow)
     */
    filterDropShadow: TailwindDropShadow
}
