import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindContentVariants<Plug extends PlugBase = ""> =
    | "none"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindContent<Plug extends PlugBase = ""> =
    `content-${TailwindContentVariants<Plug>}`

export type TailwindContentType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the content of the before and after pseudo-elements.
     *@see {@link https://tailwindcss.com/docs/content content}
     */
    content: TailwindContent<Plug>
}
