import { PlugBase, Pluggable } from "../plugin"

type TailwindBorderColor<
    Key extends string,
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = Key | `${Key}-${TailwindColor | Pluggable<Plug>}`

export type TailwindBorderColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderColor: TailwindBorderColor<"border", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderXColor: TailwindBorderColor<"border-x", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderYColor: TailwindBorderColor<"border-y", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderTopColor: TailwindBorderColor<"border-t", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderBottomColor: TailwindBorderColor<"border-b", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderLeftColor: TailwindBorderColor<"border-l", TailwindColor, Plug>
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderRightColor: TailwindBorderColor<"border-r", TailwindColor, Plug>
}

export type TailwindDivideColorType<
    TailwindColor extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the border color between elements.
     *@docs [divide-color](https://tailwindcss.com/docs/divide-color)
     */
    divideColor: TailwindBorderColor<"divide", TailwindColor, Plug>
}
