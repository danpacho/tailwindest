import { PluginVariantsWithDirection } from "../plugin"

export type TailwindPaddingType<Padding extends string> = {
    /**
     *@note Utilities for controlling an element's padding all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    padding: PluginVariantsWithDirection<"p", Padding>
    /**
     *@note Utilities for controlling an element's padding x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingX: PluginVariantsWithDirection<"px", Padding>
    /**
     *@note Utilities for controlling an element's padding y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingY: PluginVariantsWithDirection<"py", Padding>
    /**
     *@note Utilities for controlling an element's padding top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingTop: PluginVariantsWithDirection<"pt", Padding>
    /**
     *@note Utilities for controlling an element's padding bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingBottom: PluginVariantsWithDirection<"pb", Padding>
    /**
     *@note Utilities for controlling an element's padding right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingRight: PluginVariantsWithDirection<"pr", Padding>
    /**
     *@note Utilities for controlling an element's padding left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingLeft: PluginVariantsWithDirection<"pl", Padding>
}
