import { PlugBase, Pluggable } from "../plugin"

type TailwindScrollPadding<TailwindSpacing, Plug extends PlugBase = ""> =
    | TailwindSpacing
    | Pluggable<Plug>

export type TailwindScrollPaddingType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPadding: `scroll-p-${TailwindScrollPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingLeft: `scroll-pl-${TailwindScrollPadding<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingRight: `scroll-pr-${TailwindScrollPadding<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingTop: `scroll-pt-${TailwindScrollPadding<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingBottom: `scroll-pb-${TailwindScrollPadding<
        TailwindSpacing,
        Plug
    >}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingX: `scroll-px-${TailwindScrollPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingY: `scroll-py-${TailwindScrollPadding<TailwindSpacing, Plug>}`
}
