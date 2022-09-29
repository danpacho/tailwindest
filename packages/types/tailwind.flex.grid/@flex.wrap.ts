import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexWrapVariants =
    | "wrap"
    | "wrap-reverse"
    | "nowrap"
    | TailwindArbitrary
type TailwindFlexWrap = `flex-${TailwindFlexWrapVariants}`
export type TailwindFlexWrapType = {
    /**
     *@note Utilities for controlling how flex items wrap.
     *@docs [flex-wrap](https://tailwindcss.com/docs/flex-wrap)
     */
    flexWrap: TailwindFlexWrap
}
