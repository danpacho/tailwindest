import { PluginVariantsWithDirection } from "../plugin"

export type TailwindScaleType<Scale extends string> = {
    /**
     *@note Utilities for scaling elements with transform.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScale: PluginVariantsWithDirection<"scale", Scale>
    /**
     *@note Utilities for scaling elements with transform x direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleX: PluginVariantsWithDirection<"scale", Scale>
    /**
     *@note Utilities for scaling elements with transform y direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleY: PluginVariantsWithDirection<"scale", Scale>
}
