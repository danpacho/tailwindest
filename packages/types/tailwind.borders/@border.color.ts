import { PluginVariants } from "../plugin"

export type TailwindBorderColorType<BorderColor extends string> = {
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color border-color}
     */
    borderColor: PluginVariants<"border", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-x-color}
     */
    borderXColor: PluginVariants<"border-x", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-y-color}
     */
    borderYColor: PluginVariants<"border-y", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-top-color}
     */
    borderTopColor: PluginVariants<"border-t", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-bottom-color}
     */
    borderBottomColor: PluginVariants<"border-b", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-left-color}
     */
    borderLeftColor: PluginVariants<"border-l", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-right-color}
     */
    borderRightColor: PluginVariants<"border-r", BorderColor>
}

export type TailwindDivideColorType<BorderColor extends string> = {
    /**
     *@description Utilities for controlling the border color between elements.
     *@see {@link https://tailwindcss.com/docs/divide-color divide color}
     */
    divideColor: PluginVariants<"divide", BorderColor>
}
