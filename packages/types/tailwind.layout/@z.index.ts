import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindZIndexVariants<Plug extends PlugBase = ""> =
    | "0"
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "auto"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindZIndex<Plug extends PlugBase = ""> =
    `z-${TailwindZIndexVariants<Plug>}`
export type TailwindZIndexType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the stack order of an element.
     *@see {@link https://tailwindcss.com/docs/z-index z index}
     */
    zIndex: TailwindZIndex<Plug>
}
