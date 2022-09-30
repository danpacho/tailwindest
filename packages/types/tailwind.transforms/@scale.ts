import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindScaleVariants =
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
export type TailwindScaleType = {
    /**
     *@note Utilities for scaling elements with transform.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScale: `scale-${TailwindScaleVariants}`
    /**
     *@note Utilities for scaling elements with transform x direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleX: `scale-x-${TailwindScaleVariants}`
    /**
     *@note Utilities for scaling elements with transform y direction.
     *@docs [scale](https://tailwindcss.com/docs/scale)
     */
    transformScaleY: `scale-y-${TailwindScaleVariants}`
}
