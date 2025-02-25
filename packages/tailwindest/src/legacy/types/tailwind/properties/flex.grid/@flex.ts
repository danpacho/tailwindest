import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for controlling how flex items both grow and shrink.
     *@see {@link https://tailwindcss.com/docs/flex flex}
     */
    flex: TailwindFlex<Plug>
}
