import { PlugBase, Pluggable } from "../plugin"

type TailwindPadding<TailwindSpacing, Plug extends PlugBase = ""> =
    | TailwindSpacing
    | Pluggable<Plug>

export type TailwindPaddingType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling an element's padding all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    padding: `p-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingX: `px-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingY: `py-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingTop: `pt-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingBottom: `pb-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingRight: `pr-${TailwindPadding<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's padding left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingLeft: `pl-${TailwindPadding<TailwindSpacing, Plug>}`
}
