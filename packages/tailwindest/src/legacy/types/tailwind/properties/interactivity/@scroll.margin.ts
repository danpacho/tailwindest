import { PluginVariantsWithDirection } from "../../../plugin"

export type TailwindScrollMarginType<ScrollMargin extends string> = {
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin}
     */
    scrollMargin: PluginVariantsWithDirection<"scroll-m", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-left}
     */
    scrollMarginLeft: PluginVariantsWithDirection<"scroll-ml", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-right}
     */
    scrollMarginRight: PluginVariantsWithDirection<"scroll-my", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-top}
     */
    scrollMarginTop: PluginVariantsWithDirection<"scroll-mt", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-bottom}
     */
    scrollMarginBottom: PluginVariantsWithDirection<"scroll-mb", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-x}
     */
    scrollMarginX: PluginVariantsWithDirection<"scroll-mx", ScrollMargin>
    /**
     *@description Utilities for controlling the scroll offset around items in a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-margin scroll-margin-y}
     */
    scrollMarginY: PluginVariantsWithDirection<"scroll-my", ScrollMargin>
}
