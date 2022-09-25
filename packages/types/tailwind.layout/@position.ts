import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindPosition = "static" | "fixed" | "absolute" | "sticky" | "relative"
export type TailwindPositionType = {
    /**
     *@note Utilities for controlling how an element is positioned in the DOM.
     *@docs [position](https://tailwindcss.com/docs/position)
     */
    position: TailwindPosition
}

type PositionValueVarients =
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

type TailwindInsetVarients = "inset" | "inset-x" | "inset-y"
type TailwindInsetPositionValue =
    `${TailwindInsetVarients}-${PositionValueVarients}`
export type TailwindInsetPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [inset](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    inset: TailwindInsetPositionValue
}
type TailwindTopPositionValue = `top-${PositionValueVarients}`
export type TailwindTopPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    top: TailwindTopPositionValue
}
type TailwindBottomPositionValue = `bottom-${PositionValueVarients}`
export type TailwindBottomPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    bottom: TailwindBottomPositionValue
}
type TailwindLeftPositionValue = `left-${PositionValueVarients}`
export type TailwindLeftPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    left: TailwindLeftPositionValue
}
type TailwindRightPositionValue = `right-${PositionValueVarients}`
export type TailwindRightPositionValueType = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    right: TailwindRightPositionValue
}
