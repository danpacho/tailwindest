import { PlugBase, Pluggable } from "../plugin"

type TailwindScrollMargin<TailwindSpacing, Plug extends PlugBase = ""> =
    | TailwindSpacing
    | Pluggable<Plug>

export type TailwindScrollMarginType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMargin: `scroll-m-${TailwindScrollMargin<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginLeft: `scroll-ml-${TailwindScrollMargin<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginRight: `scroll-mr-${TailwindScrollMargin<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginTop: `scroll-mt-${TailwindScrollMargin<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginBottom: `scroll-mb-${TailwindScrollMargin<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginX: `scroll-mx-${TailwindScrollMargin<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginY: `scroll-my-${TailwindScrollMargin<TailwindSpacing, Plug>}`
}
