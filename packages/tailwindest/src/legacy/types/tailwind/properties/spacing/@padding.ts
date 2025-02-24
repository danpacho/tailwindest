import { PluginVariantsWithDirection } from "../../../plugin"

export type TailwindPaddingType<Padding extends string> = {
    /**
     *@description Utilities for controlling an element's padding all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding}
     */
    padding: PluginVariantsWithDirection<"p", Padding>
    /**
     *@description Utilities for controlling an element's padding x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-x}
     */
    paddingX: PluginVariantsWithDirection<"px", Padding>
    /**
     *@description Utilities for controlling an element's padding y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-y}
     */
    paddingY: PluginVariantsWithDirection<"py", Padding>
    /**
     *@description Utilities for controlling an element's padding top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-top}
     */
    paddingTop: PluginVariantsWithDirection<"pt", Padding>
    /**
     *@description Utilities for controlling an element's padding bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-bottom}
     */
    paddingBottom: PluginVariantsWithDirection<"pb", Padding>
    /**
     *@description Utilities for controlling an element's padding right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-right}
     */
    paddingRight: PluginVariantsWithDirection<"pr", Padding>
    /**
     *@description Utilities for controlling an element's padding left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/padding padding-left}
     */
    paddingLeft: PluginVariantsWithDirection<"pl", Padding>
}
