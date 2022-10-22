import { PluginVariantsWithDirection } from "../plugin"

export type TailwindScrollPaddingType<ScrollPadding extends string> = {
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPadding: PluginVariantsWithDirection<"scroll-p", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingLeft: PluginVariantsWithDirection<"scroll-pl", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingRight: PluginVariantsWithDirection<"scroll-pr", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingTop: PluginVariantsWithDirection<"scroll-pt", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingBottom: PluginVariantsWithDirection<"scroll-pb", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingX: PluginVariantsWithDirection<"scroll-px", ScrollPadding>
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingY: PluginVariantsWithDirection<"scroll-py", ScrollPadding>
}
