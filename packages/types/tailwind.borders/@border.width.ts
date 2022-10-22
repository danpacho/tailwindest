import { PluginVariants } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

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
    borderWidth: PluginVariants<"border", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderXWidth: PluginVariants<"border-x", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderYWidth: PluginVariants<"border-y", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderTopWidth: PluginVariants<"border-t", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderBottomWidth: PluginVariants<"border-b", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderLeftWidth: PluginVariants<"border-l", TailwindBorderWidth<Plug>>
    /**
     *@note Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [border-width](https://tailwindcss.com/docs/border-width)
     */
    borderRightWidth: PluginVariants<"border-r", TailwindBorderWidth<Plug>>
}

export type TailwindDivideWidthType<Plug extends string> = {
    /**
     *@note Utilities for controlling the border width between elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideX: PluginVariants<
        "divide-x",
        Exclude<TailwindBorderWidth<Plug>, "6"> | "reverse"
    >
    /**
     *@note Utilities for controlling the border width between elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@docs [divide-width](https://tailwindcss.com/docs/divide-width)
     */
    divideY: PluginVariants<
        "divide-y",
        Exclude<TailwindBorderWidth<Plug>, "6"> | "reverse"
    >
}
