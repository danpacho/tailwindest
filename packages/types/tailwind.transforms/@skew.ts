import { PluginVariantsWithDirection } from "../plugin"

export type TailwindSkewType<Skew extends string> = {
    /**
     *@note Utilities for skewing elements with transform x direction
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewX: PluginVariantsWithDirection<"skew-x", Skew>
    /**
     *@note Utilities for skewing elements with transform y direction
     *@unit Gap `1` = `1deg`
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewY: PluginVariantsWithDirection<"skew-y", Skew>
}
