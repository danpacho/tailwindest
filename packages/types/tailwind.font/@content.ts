import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindContent<Plug extends PlugBase = ""> =
    | "content-none"
    | Pluggable<Plug>
    | TailwindArbitrary

export type TailwindContentType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling word breaks in an element.
     *@see {@link https://tailwindcss.com/docs/content content}
     */
    content: TailwindContent<Plug>
}
