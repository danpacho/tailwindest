import { PlugBase, Pluggable } from "../../../plugin"

type TailwindSizeVariants<TailwindSpacing extends string> =
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
    | "auto"
    | "full"
    | "min"
    | "max"
    | "fit"
    | TailwindSpacing

export type TailwindSizeType<
    TailwindSpacing extends string,
    Plug extends PlugBase = "",
> = {
    /**
     *@description Utilities for setting the `width` and `height` of an element at the same time.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@see {@link https://tailwindcss.com/docs/size size}
     */
    size: `size-${TailwindSizeVariants<TailwindSpacing> | Pluggable<Plug>}`
}
