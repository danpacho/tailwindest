import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindFlexGrow<Plug extends PlugBase = ""> =
    | "grow"
    | "grow-0"
    | `grow-${TailwindArbitrary | Pluggable<Plug>}`

export type TailwindFlexGrowType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how flex items grow.
     *@see {@link https://tailwindcss.com/docs/flex-grow flex grow}
     */
    flexGrow: TailwindFlexGrow<Plug>
}
