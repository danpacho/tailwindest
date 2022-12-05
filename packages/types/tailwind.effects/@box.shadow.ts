import { PlugBase, Pluggable } from "../plugin"

type TailwindBoxShadowVariants<Plug extends PlugBase = ""> =
    | Pluggable<Plug>
    | "sm"
    | "md"
    | "xl"
    | "2xl"
    | "inner"
    | "none"

type TailwindBoxShadow<Plug extends PlugBase = ""> =
    | "shadow"
    | `shadow-${TailwindBoxShadowVariants<Plug>}`
export type TailwindBoxShadowType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the box shadow of an element.
     *@see {@link https://tailwindcss.com/docs/box-shadow box shadow}
     */
    boxShadow: TailwindBoxShadow<Plug>
}
