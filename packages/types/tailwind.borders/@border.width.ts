import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBorderWidthVariants =
    | "0"
    | "2"
    | "4"
    | "6"
    | "8"
    | TailwindArbitrary
type TailwindBorderWidth<Key extends string> =
    | Key
    | `${Key}-${TailwindBorderWidthVariants}`

export type TailwindBorderWidthType = {
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderWidth: TailwindBorderWidth<"border">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderXWidth: TailwindBorderWidth<"border-x">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderYWidth: TailwindBorderWidth<"border-y">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderTopWidth: TailwindBorderWidth<"border-t">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderBottomWidth: TailwindBorderWidth<"border-b">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderLeftWidth: TailwindBorderWidth<"border-l">
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderRightWidth: TailwindBorderWidth<"border-r">
}

type TailwindDivideWidth<Key extends string> =
    | Key
    | `${Key}-${Exclude<TailwindBorderWidthVariants, "6"> | "reverse"}`
export type TailwindDivideWidthType = {
    /**
     *@note Utilities for controlling the border width between elements.
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideX: TailwindDivideWidth<"divide-x">
    /**
     *@note Utilities for controlling the border width between elements.
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideY: TailwindDivideWidth<"divide-y">
}
