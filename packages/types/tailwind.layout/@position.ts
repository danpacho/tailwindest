import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindPosition = "static" | "fixed" | "absolute" | "sticky" | "relative"
export type TailwindPositionType = {
    /**
     *@note Utilities for controlling how an element is positioned in the DOM.
     *@docs [position](https://tailwindcss.com/docs/position)
     */
    position: TailwindPosition
}

type PositionValueVariants =
    | "auto"
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"
    | "96"
    | "80"
    | "72"
    | "64"
    | "60"
    | "56"
    | "52"
    | "48"
    | "44"
    | "40"
    | "36"
    | "32"
    | "28"
    | "24"
    | "20"
    | "16"
    | "14"
    | "12"
    | "11"
    | "10"
    | "9"
    | "8"
    | "7"
    | "6"
    | "5"
    | "4"
    | "3.5"
    | "3"
    | "2.5"
    | "2"
    | "1.5"
    | "1"
    | "0.5"
    | "0"
    | "px"
    | TailwindArbitrary

type TailwindInsetVariants = "inset" | "inset-x" | "inset-y"
type TailwindInsetPositionValue =
    `${TailwindInsetVariants}-${PositionValueVariants}`
export type TailwindInsetPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [inset](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    inset: TailwindInsetPositionValue
}
type TailwindTopPositionValue = `top-${PositionValueVariants}`
export type TailwindTopPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    top: TailwindTopPositionValue
}
type TailwindBottomPositionValue = `bottom-${PositionValueVariants}`
export type TailwindBottomPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    bottom: TailwindBottomPositionValue
}
type TailwindLeftPositionValue = `left-${PositionValueVariants}`
export type TailwindLeftPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    left: TailwindLeftPositionValue
}
type TailwindRightPositionValue = `right-${PositionValueVariants}`
export type TailwindRightPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    right: TailwindRightPositionValue
}
