import { TailwindColor } from "../tailwind.common/@color"

type TailwindGradientFrom = `from-${TailwindColor}`
type TailwindGradientVia = `via-${TailwindColor}`
type TailwindGradientTo = `to-${TailwindColor}`
export type TailwindGradientColorStopsType = {
    /**
     *@note Utilities for controlling the color stops in background gradients start.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientStart: TailwindGradientFrom
    /**
     *@note Utilities for controlling the color stops in background gradients middle.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientMiddle: TailwindGradientVia
    /**
     *@note Utilities for controlling the color stops in background gradients end.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientEnd: TailwindGradientTo
}
