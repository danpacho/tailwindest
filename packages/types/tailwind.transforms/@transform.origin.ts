import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTransformOriginVariants =
    | "center"
    | "top"
    | "top-right"
    | "right"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left"
    | TailwindArbitrary
type TailwindTransformOrigin = `origin-${TailwindTransformOriginVariants}`
export type TailwindTransformOriginType = {
    /**
     *@note Utilities for specifying the origin for an element's transformations.
     *@docs [transform-origin](https://tailwindcss.com/docs/transform-origin)
     */
    transformOrigin: TailwindTransformOrigin
}
