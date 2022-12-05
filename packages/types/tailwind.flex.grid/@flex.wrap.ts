import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexWrapVariants =
    | "wrap"
    | "wrap-reverse"
    | "nowrap"
    | TailwindArbitrary
type TailwindFlexWrap = `flex-${TailwindFlexWrapVariants}`
export type TailwindFlexWrapType = {
    /**
     *@description Utilities for controlling how flex items wrap.
     *@see {@link https://tailwindcss.com/docs/flex-wrap flex wrap}
     */
    flexWrap: TailwindFlexWrap
}
