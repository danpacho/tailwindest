import { PluginVariantsWithDirection } from "../plugin"

type TailwindPosition = "static" | "fixed" | "absolute" | "sticky" | "relative"
export type TailwindPositionType = {
    /**
     *@description Utilities for controlling how an element is positioned in the DOM.
     *@see {@link https://tailwindcss.com/docs/position position}
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
    TailwindSpacing extends string,
> = PluginVariantsWithDirection<
    PositionType,
    TailwindPositionValueVariants<TailwindSpacing>
>

export type TailwindPositionValueType<PositionValue extends string> = {
    /**
     *@description Utilities for controlling the placement of positioned elements.
     *@see {@link https://tailwindcss.com/docs/top-right-bottom-left inset}
     */
    inset: TailwindPositionValue<"inset" | "inset-x" | "inset-y", PositionValue>
    /**
     *@description Utilities for controlling the placement of positioned elements.
     *@see {@link https://tailwindcss.com/docs/top-right-bottom-left top}
     */
    top: TailwindPositionValue<"top", PositionValue>
    /**
     *@description Utilities for controlling the placement of positioned elements.
     *@see {@link https://tailwindcss.com/docs/top-right-bottom-left bottom}
     */
    bottom: TailwindPositionValue<"bottom", PositionValue>
    /**
     *@description Utilities for controlling the placement of positioned elements.
     *@see {@link https://tailwindcss.com/docs/top-right-bottom-left left}
     */
    left: TailwindPositionValue<"left", PositionValue>
    /**
     *@description Utilities for controlling the placement of positioned elements.
     *@see {@link https://tailwindcss.com/docs/top-right-bottom-left right}
     */
    right: TailwindPositionValue<"right", PositionValue>
}
