import { PluginVariants } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type PluginVariantsIncludeSelf<Title extends string, Value extends string> =
    | PluginVariants<Title, Value>
    | Title

type TailwindBorderWidth<Plug extends string> =
    | "0"
    | "2"
    | "4"
    | "6"
    | "8"
    | TailwindArbitrary
    | Plug

export type TailwindBorderWidthType<Plug extends string> = {
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderWidth: PluginVariantsIncludeSelf<"border", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderXWidth: PluginVariantsIncludeSelf<
        "border-x",
        TailwindBorderWidth<Plug>
    >
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderYWidth: PluginVariantsIncludeSelf<
        "border-y",
        TailwindBorderWidth<Plug>
    >
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderTopWidth: PluginVariantsIncludeSelf<
        "border-t",
        TailwindBorderWidth<Plug>
    >
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderBottomWidth: PluginVariantsIncludeSelf<
        "border-b",
        TailwindBorderWidth<Plug>
    >
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderLeftWidth: PluginVariantsIncludeSelf<
        "border-l",
        TailwindBorderWidth<Plug>
    >
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderRightWidth: PluginVariantsIncludeSelf<
        "border-r",
        TailwindBorderWidth<Plug>
    >
}

type TailwindDivideWidth<Plug extends string> =
    | "0"
    | "2"
    | "4"
    | "8"
    | "reverse"
    | Plug
    | TailwindArbitrary

export type TailwindDivideWidthType<Plug extends string> = {
    /**
     *@note Utilities for controlling the border width between x-axis elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideX: PluginVariantsIncludeSelf<"divide-x", TailwindDivideWidth<Plug>>
    /**
     *@note Utilities for controlling the border width between y-axis elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideY: PluginVariantsIncludeSelf<"divide-y", TailwindDivideWidth<Plug>>
}
