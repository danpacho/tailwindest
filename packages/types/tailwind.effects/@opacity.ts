type TailwindOpacityVariants =
    | "0"
    | "5"
    | "10"
    | "20"
    | "25"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "80"
    | "90"
    | "95"
    | "100"
type TailwindOpacity = `opacity-${TailwindOpacityVariants}`
export type TailwindOpacityType = {
    /**
     *@note Utilities for controlling the opacity of an element.
     *@docs [opacity](https://tailwindcss.com/docs/opacity)
     */
    opacity: TailwindOpacity
}
