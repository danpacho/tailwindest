import { PluginVariantsWithDirection } from "../../../plugin"

export type TailwindSkewType<Skew extends string> = {
    /**
     *@description Utilities for skewing elements with transform x direction
     *@see {@link https://tailwindcss.com/docs/skew skew-x}
     */
    transformSkewX: PluginVariantsWithDirection<"skew-x", Skew>
    /**
     *@description Utilities for skewing elements with transform y direction
     *@unit Gap `1` = `1deg`
     *@see {@link https://tailwindcss.com/docs/skew skew-y}
     */
    transformSkewY: PluginVariantsWithDirection<"skew-y", Skew>
}
