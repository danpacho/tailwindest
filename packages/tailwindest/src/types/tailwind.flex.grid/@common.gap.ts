import { PluginVariants } from "../plugin"

export type TailwindGapType<Gap extends string> = {
    /**
     *@description Utilities for controlling gutters between grid and flexbox items.
     *@see {@link https://tailwindcss.com/docs/gap gap}
     */
    gap: PluginVariants<"gap", Gap>
    /**
     *@description Utilities for controlling gutters between grid and flexbox items at x axis.
     *@see {@link https://tailwindcss.com/docs/gap gap}
     */
    gapX: PluginVariants<"gap-x", Gap>
    /**
     *@description Utilities for controlling gutters between grid and flexbox items at y axis.
     *@see {@link https://tailwindcss.com/docs/gap gap}
     */
    gapY: PluginVariants<"gap-y", Gap>
}
