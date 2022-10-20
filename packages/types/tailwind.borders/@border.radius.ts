import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBorderRadiusVariants<Plug extends PlugBase = ""> =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "full"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindBorderRadius<Key extends string, Plug extends PlugBase = ""> =
    | Key
    | `${Key}-${TailwindBorderRadiusVariants<Plug>}`
export type TailwindBorderRadiusType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderRadius: TailwindBorderRadius<"rounded", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopRadius: TailwindBorderRadius<"rounded-t", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderRightRadius: TailwindBorderRadius<"rounded-r", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomRadius: TailwindBorderRadius<"rounded-b", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderLeftRadius: TailwindBorderRadius<"rounded-l", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopLeftRadius: TailwindBorderRadius<"rounded-tl", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopRightRadius: TailwindBorderRadius<"rounded-tr", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomLeftRadius: TailwindBorderRadius<"rounded-bl", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomRightRadius: TailwindBorderRadius<"rounded-br", Plug>
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
}
