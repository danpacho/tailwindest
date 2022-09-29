import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexVariants =
    | "1"
    | "auto"
    | "initial"
    | "none"
    | TailwindArbitrary
type TailwindFlex = `flex-${TailwindFlexVariants}`
export type TailwindFlexType = {
    /**
     *@note Utilities for controlling how flex items both grow and shrink.
     *@docs [flex](https://tailwindcss.com/docs/flex)
     */
    flex: TailwindFlex
}
