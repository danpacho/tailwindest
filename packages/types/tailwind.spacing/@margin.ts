import { PlugBase, Pluggable } from "../plugin"

type TailwindMarginVariants<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = TailwindSpacing | "auto" | Pluggable<Plug>

export type TailwindMarginType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    margin: `m-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginX: `mx-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginY: `my-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginTop: `mt-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginBottom: `mb-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginRight: `mr-${TailwindMarginVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginLeft: `ml-${TailwindMarginVariants<TailwindSpacing, Plug>}`
}
