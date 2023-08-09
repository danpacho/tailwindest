import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexBasisVariants<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> =
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "1/5"
    | "2/5"
    | "3/5"
    | "4/5"
    | "1/6"
    | "2/6"
    | "3/6"
    | "4/6"
    | "5/6"
    | "1/12"
    | "2/12"
    | "3/12"
    | "4/12"
    | "5/12"
    | "6/12"
    | "7/12"
    | "8/12"
    | "9/12"
    | "10/12"
    | "11/12"
    | "full"
    | TailwindArbitrary
    | TailwindSpacing
    | Pluggable<Plug>

type TailwindFlexBasis<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = `basis-${TailwindFlexBasisVariants<TailwindSpacing, Plug>}`

export type TailwindFlexBasisType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for controlling the initial size of flex items.
     *@see {@link https://tailwindcss.com/docs/flex-basis flex basis}
     */
    flexBasis: TailwindFlexBasis<TailwindSpacing, Plug>
}
