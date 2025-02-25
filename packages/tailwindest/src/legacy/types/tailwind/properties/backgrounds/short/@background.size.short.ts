import { PlugBase, Pluggable } from "../../../../plugin"
import { TailwindArbitrary } from "../../common/@arbitrary"

type TailwindBackgroundSizeVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "cover"
    | "contain"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindBackgroundSize<Plug extends PlugBase = ""> =
    `bg-${TailwindBackgroundSizeVariants<Plug>}`
export type ShortTailwindBackgroundSizeType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the background size of an element's background image.
     *@see {@link https://tailwindcss.com/docs/background-size background size}
     */
    bgSize: TailwindBackgroundSize<Plug>
}
