import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindScaleVariants<Plug extends PlugBase = ""> =
    | "0"
    | "50"
    | "75"
    | "90"
    | "95"
    | "100"
    | "105"
    | "110"
    | "125"
    | "150"
    | TailwindArbitrary
    | Pluggable<Plug>

export type TailwindScaleType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for scaling elements with transform.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScale: `scale-${TailwindScaleVariants<Plug>}`
    /**
     *@note Utilities for scaling elements with transform x direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleX: `scale-x-${TailwindScaleVariants<Plug>}`
    /**
     *@note Utilities for scaling elements with transform y direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleY: `scale-y-${TailwindScaleVariants<Plug>}`
}
