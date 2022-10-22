import { PluginVariants } from "../plugin"

export type TailwindGapType<Gap extends string> = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gap: PluginVariants<"gap", Gap>
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at x axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapX: PluginVariants<"gap-x", Gap>
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at y axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapY: PluginVariants<"gap-y", Gap>
}
