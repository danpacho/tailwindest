import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexShrink<Plug extends PlugBase = ""> =
    | "shrink"
    | "shrink-0"
    | `shirink-${TailwindArbitrary | Pluggable<Plug>}`

export type TailwindFlexShrinkType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how flex items shrink.
     *@see {@link https://tailwindcss.com/docs/flex-shrink flex shrink}
     */
    flexShrink: TailwindFlexShrink<Plug>
}
