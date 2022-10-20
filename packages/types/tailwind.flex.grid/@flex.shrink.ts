import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexShrink<Plug extends PlugBase = ""> =
    | "shrink"
    | "shrink-0"
    | `shirink-${TailwindArbitrary | Pluggable<Plug>}`

export type TailwindFlexShrinkType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how flex items shrink.
     *@docs [flex-shrink](https://tailwindcss.com/docs/flex-shrink)
     */
    flexShrink: TailwindFlexShrink<Plug>
}
