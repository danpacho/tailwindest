import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { TailwindLineHeightVariants } from "./@line.height"

type TailwindFontSizeVariants<Plug extends PlugBase = ""> =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindFontSize<
    FontSizePlug extends PlugBase = "",
    LineHeightPlug extends PlugBase = ""
> =
    | `text-${TailwindFontSizeVariants<FontSizePlug>}`
    | `text-${TailwindFontSizeVariants<FontSizePlug>}/${TailwindLineHeightVariants<LineHeightPlug>}`
export type TailwindFontSizeType<
    FontSizePlug extends PlugBase = "",
    LineHeightPlug extends PlugBase = ""
> = {
    /**
     *@description Utilities for controlling the font size of an element.
     *@unit Base size(`text-base`) = `1rem`
     *@see {@link https://tailwindcss.com/docs/font-size font size}
     */
    fontSize: TailwindFontSize<FontSizePlug, LineHeightPlug>
}
