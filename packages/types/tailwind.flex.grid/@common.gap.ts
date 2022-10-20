import { PlugBase, Pluggable } from "../plugin"

export type TailwindGapType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gap: `gap-${TailwindSpacing | Pluggable<Plug>}`
}

export type TailwindGapXType<
    TaiwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at x axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapX: `gap-x-${TaiwindSpacing | Pluggable<Plug>}`
}

export type TailwindGapYType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling gutters between grid and flexbox items at y axis.
     *@docs [gap](https://tailwindcss.com/docs/gap)
     */
    gapY: `gap-y-${TailwindSpacing | Pluggable<Plug>}`
}
