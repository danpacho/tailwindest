type TailwindBackgroundBlendModeVariants =
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
type TailwindBackgroundBlendMode =
    `bg-blend-${TailwindBackgroundBlendModeVariants}`
export type ShortTailwindBackgroundBlendModeType = {
    /**
     *@description Utilities for controlling how an element's background image should blend with its background color.
     *@see {@link https://tailwindcss.com/docs/background-blend-mode background blend mode}
     */
    bgBlendMode: TailwindBackgroundBlendMode
}
