import { PlugBase, Pluggable } from "../../plugin"
import { TailwindArbitrary } from "../../tailwind.common/@arbitrary"

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
export type ShortTailwindBorderRadiusType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-radius}
     */
    borderRadius: TailwindBorderRadius<"rounded", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-top-radius}
     */
    borderTRadius: TailwindBorderRadius<"rounded-t", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-right-radius}
     */
    borderRRadius: TailwindBorderRadius<"rounded-r", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-bottom-radius}
     */
    borderBRadius: TailwindBorderRadius<"rounded-b", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-left-radius}
     */
    borderLRadius: TailwindBorderRadius<"rounded-l", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-top-left-radius}
     */
    borderTLRadius: TailwindBorderRadius<"rounded-tl", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-top-right-radius}
     */
    borderTRRadius: TailwindBorderRadius<"rounded-tr", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-bottom-left-radius}
     */
    borderBLRadius: TailwindBorderRadius<"rounded-bl", Plug>
    /**
     *@description Utilities for controlling the border radius of an element.
     *@see {@link https://tailwindcss.com/docs/border-radius border-bottom-right-radius}
     */
    borderBRRadius: TailwindBorderRadius<"rounded-br", Plug>
}
