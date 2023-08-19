import { PluginVariants } from "../../../../plugin"
import { TailwindArbitrary } from "../../common/@arbitrary"

type PluginVariantsIncludeSelf<Title extends string, Value extends string> =
    | PluginVariants<Title, Value>
    | Title

type TailwindBorderWidth<Plug extends string> =
    | "0"
    | "2"
    | "4"
    | "8"
    | TailwindArbitrary
    | Plug

export type ShortTailwindBorderWidthType<Plug extends string> = {
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-width}
     */
    borderW: PluginVariantsIncludeSelf<"border", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-x-width}
     */
    borderXW: PluginVariantsIncludeSelf<"border-x", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-y-width}
     */
    borderYW: PluginVariantsIncludeSelf<"border-y", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-top-width}
     */
    borderTW: PluginVariantsIncludeSelf<"border-t", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-bottom-width}
     */
    borderBW: PluginVariantsIncludeSelf<"border-b", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-left-width}
     */
    borderLW: PluginVariantsIncludeSelf<"border-l", TailwindBorderWidth<Plug>>
    /**
     *@description Utilities for controlling the width of an element's borders.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/border-width border-right-width}
     */
    borderRW: PluginVariantsIncludeSelf<"border-r", TailwindBorderWidth<Plug>>
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
     *@description Utilities for controlling the border width between x-axis elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/divide-width divide-x-width}
     */
    divideX: PluginVariantsIncludeSelf<"divide-x", TailwindDivideWidth<Plug>>
    /**
     *@description Utilities for controlling the border width between y-axis elements.
     *@unit Gap `2` = `2px` = `0.125rem`
     *@see {@link https://tailwindcss.com/docs/divide-width divide-y-width}
     */
    divideY: PluginVariantsIncludeSelf<"divide-y", TailwindDivideWidth<Plug>>
}
