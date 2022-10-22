import { PlugBase, Pluggable, PluginVariantsWithDirection } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindRotateVariants<Plug extends PlugBase = ""> =
    | "0"
    | "1"
    | "2"
    | "3"
    | "6"
    | "12"
    | "45"
    | "90"
    | "180"
    | TailwindArbitrary
    | Pluggable<Plug>

export type TailwindRotateType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for rotating elements with transform.
     *@docs [rotate](https://tailwindcss.com/docs/rotate)
     *@unit Gap `1` = `1deg`
     */
    transformRotate: PluginVariantsWithDirection<
        "rotate",
        TailwindRotateVariants<Plug>
    >
}
