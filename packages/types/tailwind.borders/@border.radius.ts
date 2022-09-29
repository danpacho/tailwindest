import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBorderRadiusVariants =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "full"
    | TailwindArbitrary
type TailwindBorderRadius<Key extends string> =
    | Key
    | `${Key}-${TailwindBorderRadiusVariants}`
export type TailwindBorderRadiusType = {
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderRadius: TailwindBorderRadius<"rounded">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopRadius: TailwindBorderRadius<"rounded-t">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderRightRadius: TailwindBorderRadius<"rounded-r">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomRadius: TailwindBorderRadius<"rounded-b">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderLeftRadius: TailwindBorderRadius<"rounded-l">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopLeftRadius: TailwindBorderRadius<"rounded-tl">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderTopRightRadius: TailwindBorderRadius<"rounded-tr">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomLeftRadius: TailwindBorderRadius<"rounded-bl">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
    borderBottomRightRadius: TailwindBorderRadius<"rounded-br">
    /**
     *@note Utilities for controlling the border radius of an element.
     *@docs [border-radius](https://tailwindcss.com/docs/border-radius)
     */
}
