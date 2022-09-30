type TailwindHueRotateVariants = "0" | "15" | "30" | "60" | "90" | "100"
type TailwindHueRotate =
    | `hue-rotate-${TailwindHueRotateVariants}`
    | `-hue-rotate-${TailwindHueRotateVariants}`
export type TailwindHueRotateType = {
    /**
     *@note Utilities for applying hue-rotate filters to an element.
     *@docs [hue-rotate](https://tailwindcss.com/docs/hue-rotate)
     */
    filterHueRotate: TailwindHueRotate
}

type TailwindBackdropHueRotate =
    | `backdrop-hue-rotate-${TailwindHueRotateVariants}`
    | `-backdrop-hue-rotate-${TailwindHueRotateVariants}`
export type TailwindBackdropHueRotateType = {
    /**
     *@note Utilities for applying backdrop hue-rotate filters to an element.
     *@docs [backdrop-hue-rotate](https://tailwindcss.com/docs/backdrop-hue-rotate)
     */
    backdropHueRotate: TailwindBackdropHueRotate
}
