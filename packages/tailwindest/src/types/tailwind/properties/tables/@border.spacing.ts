import { PluginVariants } from "../../../plugin"

export type TailwindBorderSpacingType<TailwindSpacing extends string> = {
    /**
     *@description Utilities for controlling the spacing between table borders.
     *@see {@link https://tailwindcss.com/docs/border-spacing border-spacing}
     */
    borderSpacing: PluginVariants<"border-spacing", TailwindSpacing>
    /**
     *@description Utilities for controlling the spacing between table borders x direction.
     *@see {@link https://tailwindcss.com/docs/border-spacing border-spacing-x}
     */
    borderSpacingX: PluginVariants<"border-spacing-x", TailwindSpacing>
    /**
     *@description Utilities for controlling the spacing between table borders y direction.
     *@see {@link https://tailwindcss.com/docs/border-spacing border-spacing-y}
     */
    borderSpacingY: PluginVariants<"border-spacing-y", TailwindSpacing>
}
