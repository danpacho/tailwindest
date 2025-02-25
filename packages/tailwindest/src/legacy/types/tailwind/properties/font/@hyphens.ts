import { PlugBase, Pluggable } from "../../../plugin"

type TailwindHyphensVariants<Plug extends PlugBase = ""> =
    | "none"
    | "manual"
    | "auto"
    | Pluggable<Plug>
type TailwindHyphens<Plug extends PlugBase = ""> =
    `hyphens-${TailwindHyphensVariants<Plug>}`

export type TailwindHyphensType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling how words should be hyphenated.
     *@see {@link https://tailwindcss.com/docs/hyphens hyphens}
     */
    hyphens: TailwindHyphens<Plug>
}
