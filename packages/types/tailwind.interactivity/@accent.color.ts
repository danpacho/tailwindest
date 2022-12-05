import { PlugBase, Pluggable } from "../plugin"

export type TailwindAccentColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the accented color of a form control.
     *@see {@link https://tailwindcss.com/docs/accent-color accent color}
     */
    accentColor: `accent-${TailwindColor | Pluggable<Plug>}`
}
