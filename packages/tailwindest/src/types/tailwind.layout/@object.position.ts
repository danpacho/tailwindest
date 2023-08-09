import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindObjectPositionVariants<Plug extends PlugBase = ""> =
    | "top"
    | "center"
    | "bottom"
    | "left"
    | "left-top"
    | "left-bottom"
    | "right"
    | "right-top"
    | "right-bottom"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindObjectPosition<Plug extends PlugBase = ""> =
    `object-${TailwindObjectPositionVariants<Plug>}`
export type TailwindObjectPositionType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how a replaced element's content should be positioned within its container.
     *@see {@link https://tailwindcss.com/docs/object-position object position}
     */
    objectPosition: TailwindObjectPosition<Plug>
}
