import {
    PlugBase,
    Pluggable,
    PluginVariantsWithDirection,
} from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

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
     *@description Utilities for rotating elements with transform.
     *@see {@link https://tailwindcss.com/docs/rotate rotate}
     *@unit Gap `1` = `1deg`
     */
    transformRotate: PluginVariantsWithDirection<
        "rotate",
        TailwindRotateVariants<Plug>
    >
}
