import { TailwindColor } from "../tailwind.common/@color"

type TailwindBorderColor<Key extends string> = Key | `${Key}-${TailwindColor}`
export type TailwindBorderColorType = {
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderColor: TailwindBorderColor<"border">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderXColor: TailwindBorderColor<"border-x">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderYColor: TailwindBorderColor<"border-y">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderTopColor: TailwindBorderColor<"border-t">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderBottomColor: TailwindBorderColor<"border-b">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderLeftColor: TailwindBorderColor<"border-l">
    /**
     *@note Utilities for controlling the color of an element's borders.
     *@docs [border-color](https://tailwindcss.com/docs/border-color)
     */
    borderRightColor: TailwindBorderColor<"border-r">
}

export type TailwindDivideColorType = {
    /**
     *@note Utilities for controlling the border color between elements.
     *@docs [divide-color](https://tailwindcss.com/docs/divide-color)
     */
    divideColor: TailwindBorderColor<"divide">
}
