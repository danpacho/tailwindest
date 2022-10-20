import { PlugBase, Pluggable } from "../plugin"

export type TailwindBorderSpacingType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the spacing between table borders.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacing: `border-spacing-${TailwindSpacing | Pluggable<Plug>}`
    /**
     *@note Utilities for controlling the spacing between table borders x direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingX: `border-spacing-x-${TailwindSpacing | Pluggable<Plug>}`
    /**
     *@note Utilities for controlling the spacing between table borders y direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingY: `border-spacing-y-${TailwindSpacing | Pluggable<Plug>}`
}
