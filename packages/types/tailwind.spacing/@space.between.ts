import { PlugBase, Pluggable } from "../plugin"

type TailwindSpaceVariants<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = TailwindSpacing | "reverse" | Pluggable<Plug>

export type TailwindSpaceType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceX: `space-x-${TailwindSpaceVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceY: `space-y-${TailwindSpaceVariants<TailwindSpacing, Plug>}`
}
