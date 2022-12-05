import { PluginVariants } from "../plugin"

export type TailwindGradientColorStopsType<GradientColor extends string> = {
    /**
     *@description Utilities for controlling the color stops in background gradients start.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color start}
     */
    backgroundImageGradientStart: PluginVariants<"from", GradientColor>
    /**
     *@description Utilities for controlling the color stops in background gradients middle.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color middle}
     */
    backgroundImageGradientMiddle: PluginVariants<"via", GradientColor>
    /**
     *@description Utilities for controlling the color stops in background gradients end.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color end}
     */
    backgroundImageGradientEnd: PluginVariants<"to", GradientColor>
}
