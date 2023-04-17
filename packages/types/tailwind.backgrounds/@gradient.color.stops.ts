import { PluginVariants } from "../plugin"

type GradientPosition =
    | "0%"
    | "5%"
    | "10%"
    | "15%"
    | "20%"
    | "25%"
    | "30%"
    | "35%"
    | "40%"
    | "45%"
    | "50%"
    | "55%"
    | "60%"
    | "65%"
    | "70%"
    | "75%"
    | "80%"
    | "85%"
    | "90%"
    | "95%"
    | "100%"

export type TailwindGradientColorStopsType<GradientColor extends string> = {
    /**
     *@description Utilities for controlling the color stops in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color start}
     */
    gradientStart: PluginVariants<"from", GradientColor>
    /**
     *@description Utilities for controlling the color stops in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color middle}
     */
    gradientMiddle: PluginVariants<"via", GradientColor>
    /**
     *@description Utilities for controlling the color stops in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color end}
     */
    gradientEnd: PluginVariants<"to", GradientColor>
    /**
     *@description Utilities for controlling the color stops position in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color start position}
     */
    gradientStartPosition: PluginVariants<"from", GradientPosition>
    /**
     *@description Utilities for controlling the color stops position in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color middle position}
     */
    gradientMiddlePosition: PluginVariants<"via", GradientPosition>
    /**
     *@description Utilities for controlling the color stops position in gradient background image.
     *@see {@link https://tailwindcss.com/docs/gradient-color-stops gradient color end position}
     */
    gradientEndPosition: PluginVariants<"to", GradientPosition>
}
