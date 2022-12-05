import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTextDecorationThicknessVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "from-font"
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | Pluggable<Plug>
    | TailwindArbitrary

type TailwindTextDecorationThickness<Plug extends PlugBase = ""> =
    `decoration-${TailwindTextDecorationThicknessVariants<Plug>}`
export type TailwindTextDecorationThicknessType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the thickness of text decorations.
     *@see {@link https://tailwindcss.com/docs/text-decoration-thickness text decoration thickness}
     */
    textDecorationThickness: TailwindTextDecorationThickness<Plug>
}
