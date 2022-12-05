import { PlugBase, Pluggable } from "../plugin"
import { MinSizingVariants, SizingVariants } from "./@sizing.variants"

type TailwindHeightVariants<TailwindSpacing extends string> =
    | SizingVariants<TailwindSpacing>
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
export type TailwindHeightType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for setting the height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/height height}
     */
    height: `h-${TailwindHeightVariants<TailwindSpacing> | Pluggable<Plug>}`
}

type TailwindMinHeight<Plug extends PlugBase = ""> = `min-h-${
    | "screen"
    | MinSizingVariants
    | Pluggable<Plug>}`
export type TailwindMinHeightType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for setting the minimum height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/min-height min-height}
     */
    minHeight: TailwindMinHeight<Plug>
}

export type TailwindMaxHeightType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@description Utilities for setting the maximum height of an element.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/max-height max-height}
     */
    maxHeight: `max-h-${
        | "screen"
        | Exclude<SizingVariants<TailwindSpacing>, "auto">
        | Pluggable<Plug>}`
}
