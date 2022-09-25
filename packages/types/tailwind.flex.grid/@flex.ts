import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindFlexVarients =
    | "1"
    | "auto"
    | "initial"
    | "none"
    | TailwindArbitrary
type TailwindFlex = `flex-${TailwindFlexVarients}`
export type TailwindFlexType = {
    /**
     *@note Utilities for controlling how flex items both grow and shrink.
     *@docs [flex](https://tailwindcss.com/docs/flex)
     */
    flex: TailwindFlex
}
