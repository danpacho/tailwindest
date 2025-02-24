import { PlugBase, Pluggable } from "../../../plugin"
import { MinSizingVariants, SizingVariants } from "./@sizing.variants"

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
export type TailwindWidthType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/width width}
     */
    width: `w-${TailwindSizingVariants<TailwindSpacing> | Pluggable<Plug>}`
}

type TailwindMinWidth<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = `min-w-${MinSizingVariants | TailwindSpacing | Pluggable<Plug>}`
export type TailwindMinWidthType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the minimum width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/min-width min-width}
     */
    minWidth: TailwindMinWidth<TailwindSpacing, Plug>
}

type TailwindMaxWidthVariants<TailwindSpacing extends string> =
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
    | TailwindSpacing

type TailwindMaxWidth<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = `max-w-${TailwindMaxWidthVariants<TailwindSpacing> | Pluggable<Plug>}`
export type TailwindMaxWidthType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the maximum width of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/max-width max-width}
     */
    maxWidth: TailwindMaxWidth<TailwindSpacing, Plug>
}
