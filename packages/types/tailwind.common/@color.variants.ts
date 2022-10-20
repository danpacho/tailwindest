import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "./@arbitrary"

export type TailwindColorVariants =
    | "slate"
    | "gray"
    | "neutral"
    | "stone"
    | "red"
    | "orange"
    | "yellow"
    | "lime"
    | "amber"
    | "green"
    | "teal"
    | "blue"
    | "indigo"
    | "sky"
    | "cyan"
    | "emerald"
    | "violet"
    | "fuchsia"
    | "pink"
    | "rose"
    | "purple"

export type TailwindColorWithNoVariants<Plug extends PlugBase = ""> =
    | "inherit"
    | "current"
    | "transparent"
    | "black"
    | "white"
    | Pluggable<Plug>
    | TailwindArbitrary
