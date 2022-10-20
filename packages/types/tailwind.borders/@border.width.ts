import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBorderWidthVariants<Plug extends PlugBase = ""> =
    | "0"
    | "2"
    | "4"
    | "6"
    | "8"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindBorderWidth<Key extends string, Plug extends PlugBase = ""> =
    | Key
    | `${Key}-${TailwindBorderWidthVariants<Plug>}`

export type TailwindBorderWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderWidth: TailwindBorderWidth<"border", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderXWidth: TailwindBorderWidth<"border-x", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderYWidth: TailwindBorderWidth<"border-y", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderTopWidth: TailwindBorderWidth<"border-t", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderBottomWidth: TailwindBorderWidth<"border-b", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderLeftWidth: TailwindBorderWidth<"border-l", Plug>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderRightWidth: TailwindBorderWidth<"border-r", Plug>
}

type TailwindDivideWidth<Key extends string, Plug extends PlugBase = ""> =
    | Key
    | `${Key}-${Exclude<TailwindBorderWidthVariants<Plug>, "6"> | "reverse"}`
export type TailwindDivideWidthType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the border width between elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideX: TailwindDivideWidth<"divide-x", Plug>
    /**
     *@note Utilities for controlling the border width between elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideY: TailwindDivideWidth<"divide-y", Plug>
}
