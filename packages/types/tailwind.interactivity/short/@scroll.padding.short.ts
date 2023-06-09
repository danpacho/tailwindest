import { PluginVariantsWithDirection } from "../../plugin"

export type ShortTailwindScrollPaddingType<ScrollPadding extends string> = {
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding}
     */
    scrollP: PluginVariantsWithDirection<"scroll-p", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-left}
     */
    scrollPL: PluginVariantsWithDirection<"scroll-pl", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-right}
     */
    scrollPR: PluginVariantsWithDirection<"scroll-pr", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-top}
     */
    scrollPT: PluginVariantsWithDirection<"scroll-pt", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-bottom}
     */
    scrollPB: PluginVariantsWithDirection<"scroll-pb", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-x}
     */
    scrollPX: PluginVariantsWithDirection<"scroll-px", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-y}
     */
    scrollPY: PluginVariantsWithDirection<"scroll-py", ScrollPadding>
}
