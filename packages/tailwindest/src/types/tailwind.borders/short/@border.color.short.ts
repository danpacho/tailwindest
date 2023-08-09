import { PluginVariants } from "../../plugin"

export type ShortTailwindBorderColorType<BorderColor extends string> = {
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color border color}
     */
    border: PluginVariants<"border", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-x-color}
     */
    borderX: PluginVariants<"border-x", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-y-color}
     */
    borderY: PluginVariants<"border-y", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-top-color}
     */
    borderT: PluginVariants<"border-t", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-bottom-color}
     */
    borderB: PluginVariants<"border-b", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-left-color}
     */
    borderL: PluginVariants<"border-l", BorderColor>
    /**
     *@description Utilities for controlling the color of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-color  border-right-color}
     */
    borderR: PluginVariants<"border-r", BorderColor>
}

export type ShortTailwindDivideColorType<DivideColor extends string> = {
    /**
     *@description Utilities for controlling the border color between elements.
     *@see {@link https://tailwindcss.com/docs/divide-color divide color}
     */
    divide: PluginVariants<"divide", DivideColor>
}
