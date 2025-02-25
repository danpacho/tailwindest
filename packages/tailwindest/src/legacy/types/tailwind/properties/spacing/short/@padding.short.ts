import { PluginVariantsWithDirection } from "../../../../plugin"

export type ShortTailwindPaddingType<Padding extends string> = {
    /**
     *@description Utilities for controlling an element's padding all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding}
     */
    p: PluginVariantsWithDirection<"p", Padding>
    /**
     *@description Utilities for controlling an element's padding x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-x}
     */
    px: PluginVariantsWithDirection<"px", Padding>
    /**
     *@description Utilities for controlling an element's padding y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-y}
     */
    py: PluginVariantsWithDirection<"py", Padding>
    /**
     *@description Utilities for controlling an element's padding top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-top}
     */
    pt: PluginVariantsWithDirection<"pt", Padding>
    /**
     *@description Utilities for controlling an element's padding bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-bottom}
     */
    pb: PluginVariantsWithDirection<"pb", Padding>
    /**
     *@description Utilities for controlling an element's padding right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-right}
     */
    pr: PluginVariantsWithDirection<"pr", Padding>
    /**
     *@description Utilities for controlling an element's padding left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-left}
     */
    pl: PluginVariantsWithDirection<"pl", Padding>
}
