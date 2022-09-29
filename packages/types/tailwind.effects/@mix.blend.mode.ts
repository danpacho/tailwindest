type TailwindMixBlendModeVariants =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity"
    | "plus-lighter"

type TailwindMixBlendMode = `mix-blend-${TailwindMixBlendModeVariants}`
export type TailwindMixBlendModeType = {
    /**
     *@note
     *@docs [mix-blend-mode](https://tailwindcss.com/docs/mix-blend-mode)
     */
    mixBlendMode: TailwindMixBlendMode
}
