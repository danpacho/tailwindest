import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindContent<Plug extends PlugBase = ""> =
    | "content-none"
    | Pluggable<Plug>
    | TailwindArbitrary

export type TailwindContentType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling word breaks in an element.
     *@docs [content](https://tailwindcss.com/docs/content)
     */
    content: TailwindContent<Plug>
}
