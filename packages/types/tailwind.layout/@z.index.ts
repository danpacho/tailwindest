import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindZIndexVariants =
    | "0"
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "auto"
    | TailwindArbitrary
type TailwindZIndex = `z-${TailwindZIndexVariants}`
export type TailwindZIndexType = {
    /**
     *@note Utilities for controlling the stack order of an element.
     *@docs [z-index](https://tailwindcss.com/docs/z-index)
     */
    zIndex: TailwindZIndex
}
