import { PluginVariants } from "../plugin"

export type TailwindBorderSpacingType<BorderSpacing extends string> = {
    /**
     *@note Utilities for controlling the spacing between table borders.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacing: PluginVariants<"border-spacing", BorderSpacing>
    /**
     *@note Utilities for controlling the spacing between table borders x direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingX: PluginVariants<"border-spacing-x", BorderSpacing>
    /**
     *@note Utilities for controlling the spacing between table borders y direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingY: PluginVariants<"border-spacing-y", BorderSpacing>
}
