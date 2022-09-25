import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindZIndexVarients =
    | "0"
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "auto"
    | TailwindArbitrary
type TailwindZIndex = `z-${TailwindZIndexVarients}`
export type TailwindZIndexType = {
    /**
     *@note Utilities for controlling the stack order of an element.
     *@docs [z-index](https://tailwindcss.com/docs/z-index)
     */
    zIndex: TailwindZIndex
}
