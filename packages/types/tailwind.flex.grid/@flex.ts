import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexVariants<Plug extends PlugBase = ""> =
    | "1"
    | "auto"
    | "initial"
    | "none"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindFlex<Plug extends PlugBase = ""> =
    `flex-${TailwindFlexVariants<Plug>}`
export type TailwindFlexType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how flex items both grow and shrink.
     *@docs [flex](https://tailwindcss.com/docs/flex)
     */
    flex: TailwindFlex<Plug>
}
