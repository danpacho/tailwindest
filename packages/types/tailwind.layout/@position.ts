import { PluginVariantsWithDirection } from "../plugin"

type TailwindPosition = "static" | "fixed" | "absolute" | "sticky" | "relative"
export type TailwindPositionType = {
    /**
     *@note Utilities for controlling how an element is positioned in the DOM.
     *@docs [position](https://tailwindcss.com/docs/position)
     */
    position: TailwindPosition
}

type TailwindPositionValueVariants<TailwindSpacing extends string> =
    | TailwindSpacing
    | "auto"
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"

type TailwindPositionValue<
    PositionType extends string,
    TailwindSpacing extends string
> = PluginVariantsWithDirection<
    PositionType,
    TailwindPositionValueVariants<TailwindSpacing>
>

export type TailwindPositionValueType<PositionValue extends string> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [inset](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    inset: TailwindPositionValue<"inset" | "inset-x" | "inset-y", PositionValue>
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    top: TailwindPositionValue<"top", PositionValue>
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    bottom: TailwindPositionValue<"bottom", PositionValue>
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    left: TailwindPositionValue<"left", PositionValue>
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    right: TailwindPositionValue<"right", PositionValue>
}
