import { PluginVariantsWithDirection } from "../plugin"

export type TailwindScrollPaddingType<ScrollPadding extends string> = {
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding}
     */
    scrollPadding: PluginVariantsWithDirection<"scroll-p", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-left}
     */
    scrollPaddingLeft: PluginVariantsWithDirection<"scroll-pl", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-right}
     */
    scrollPaddingRight: PluginVariantsWithDirection<"scroll-pr", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-top}
     */
    scrollPaddingTop: PluginVariantsWithDirection<"scroll-pt", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-bottom}
     */
    scrollPaddingBottom: PluginVariantsWithDirection<"scroll-pb", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-x}
     */
    scrollPaddingX: PluginVariantsWithDirection<"scroll-px", ScrollPadding>
    /**
     *@description Utilities for controlling an element's scroll offset within a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/scroll-padding scroll-padding-y}
     */
    scrollPaddingY: PluginVariantsWithDirection<"scroll-py", ScrollPadding>
}
