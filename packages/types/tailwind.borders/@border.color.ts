import { PluginVariants } from "../plugin"

export type TailwindBorderColorType<BorderColor extends string> = {
    /**
     *@note border shorthand syntax
     *@note `<color>` `border-solid`
     *@docs [border](https://tailwindcss.com/docs/border-width)
     */
    border: `${PluginVariants<"border", BorderColor>} border-solid`
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderColor: PluginVariants<"border", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderXColor: PluginVariants<"border-x", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderYColor: PluginVariants<"border-y", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderTopColor: PluginVariants<"border-t", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderBottomColor: PluginVariants<"border-b", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderLeftColor: PluginVariants<"border-l", BorderColor>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderRightColor: PluginVariants<"border-r", BorderColor>
}

export type TailwindDivideColorType<BorderColor extends string> = {
    /**
     *@note Utilities for controlling the border color between elements.
     *@docs [divide-color](https://tailwindcss.com/docs/divide-color)
     */
    divideColor: PluginVariants<"divide", BorderColor>
}
