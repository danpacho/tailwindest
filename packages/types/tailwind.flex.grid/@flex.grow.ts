import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexGrow<Plug extends PlugBase = ""> =
    | "grow"
    | "grow-0"
    | `grow-${TailwindArbitrary | Pluggable<Plug>}`

export type TailwindFlexGrowType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling how flex items grow.
     *@docs [flex-grow](https://tailwindcss.com/docs/flex-grow)
     */
    flexGrow: TailwindFlexGrow<Plug>
}
