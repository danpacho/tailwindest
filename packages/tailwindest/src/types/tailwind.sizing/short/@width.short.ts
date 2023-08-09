import { PlugBase, Pluggable } from "../../plugin"
import { TailwindArbitrary } from "../../tailwind.common/@arbitrary"
import { MinSizingVariants, SizingVariants } from "../@sizing.variants"

type TailwindSizingVariants<TailwindSpacing extends string> =
    | SizingVariants<TailwindSpacing>
    | "1/2"
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
export type ShortTailwindWidthType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/width width}
     */
    w: `w-${TailwindSizingVariants<TailwindSpacing> | Pluggable<Plug>}`
}

type TailwindMinWidth<Plug extends PlugBase = ""> = `min-w-${
    | MinSizingVariants
    | Pluggable<Plug>}`
export type ShortTailwindMinWidthType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for setting the minimum width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/min-width min-width}
     */
    minW: TailwindMinWidth<Plug>
}

type TailwindMaxWidthVariants<Plug extends PlugBase = ""> = Pluggable<
    | "0"
    | "none"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "full"
    | "min"
    | "max"
    | "fit"
    | "prose"
    | "screen-sm"
    | "screen-md"
    | "screen-lg"
    | "screen-xl"
    | "screen-2xl"
    | Plug
    | TailwindArbitrary
>

type TailwindMaxWidth<Plug extends PlugBase = ""> =
    `max-w-${TailwindMaxWidthVariants<Plug>}`
export type ShortTailwindMaxWidthType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for setting the maximum width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/max-width max-width}
     */
    maxW: TailwindMaxWidth<Plug>
}
