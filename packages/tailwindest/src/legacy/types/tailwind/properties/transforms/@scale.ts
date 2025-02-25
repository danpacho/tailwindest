import { PluginVariantsWithDirection } from "../../../plugin"

export type TailwindScaleType<Scale extends string> = {
    /**
     *@description Utilities for scaling elements with transform.
     *@see {@link https://tailwindcss.com/docs/scale scale}
     */
    transformScale: PluginVariantsWithDirection<"scale", Scale>
    /**
     *@description Utilities for scaling elements with transform x direction.
     *@see {@link https://tailwindcss.com/docs/scale scale-x}
     */
    transformScaleX: PluginVariantsWithDirection<"scale-x", Scale>
    /**
     *@description Utilities for scaling elements with transform y direction.
     *@see {@link https://tailwindcss.com/docs/scale scale-y}
     */
    transformScaleY: PluginVariantsWithDirection<"scale-y", Scale>
}
