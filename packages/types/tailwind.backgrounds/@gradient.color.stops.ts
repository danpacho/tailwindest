import { PlugBase, Pluggable } from "../plugin"

type TailwindGradientColorStops<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = TailwindColor | Pluggable<Plug>

export type TailwindGradientColorStopsType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color stops in background gradients start.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientStart: `from-${TailwindGradientColorStops<
        TailwindColor,
        Plug
    >}`
    /**
     *@note Utilities for controlling the color stops in background gradients middle.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientMiddle: `via-${TailwindGradientColorStops<
        TailwindColor,
        Plug
    >}`
    /**
     *@note Utilities for controlling the color stops in background gradients end.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientEnd: `to-${TailwindGradientColorStops<
        TailwindColor,
        Plug
    >}`
}
