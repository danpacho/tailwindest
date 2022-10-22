import { PluginVariants } from "../plugin"

export type TailwindGradientColorStopsType<GradientColor extends string> = {
    /**
     *@note Utilities for controlling the color stops in background gradients start.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientStart: PluginVariants<"from", GradientColor>
    /**
     *@note Utilities for controlling the color stops in background gradients middle.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientMiddle: PluginVariants<"via", GradientColor>
    /**
     *@note Utilities for controlling the color stops in background gradients end.
     *@docs [gradient-color-stops](https://tailwindcss.com/docs/gradient-color-stops)
     */
    backgroundImageGradientEnd: PluginVariants<"to", GradientColor>
}
