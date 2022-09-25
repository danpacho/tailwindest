import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindFlexWrapVarients =
    | "wrap"
    | "wrap-reverse"
    | "nowrap"
    | TailwindArbitrary
type TailwindFlexWrap = `flex-${TailwindFlexWrapVarients}`
export type TailwindFlexWrapType = {
    /**
     *@note Utilities for controlling how flex items wrap.
     *@docs [flex-wrap](https://tailwindcss.com/docs/flex-wrap)
     */
    flexWrap: TailwindFlexWrap
}
