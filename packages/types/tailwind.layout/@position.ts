import { PlugBase, Pluggable } from "../plugin"

type TailwindPosition = "static" | "fixed" | "absolute" | "sticky" | "relative"
export type TailwindPositionType = {
    /**
     *@note Utilities for controlling how an element is positioned in the DOM.
     *@docs [position](https://tailwindcss.com/docs/position)
     */
    position: TailwindPosition
}

type PositionValueCommonVariants<TailwindSpacing extends string> =
    | TailwindSpacing
    | "auto"
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"

type TailwindInsetVariants =
    | "inset"
    | "-inset"
    | "inset-x"
    | "-inset-x"
    | "inset-y"
    | "-inset-y"
type TailwindInsetPositionValue<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = `${TailwindInsetVariants}-${
    | PositionValueCommonVariants<TailwindSpacing>
    | Pluggable<Plug>}`
export type TailwindInsetPositionValueType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [inset](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    inset: TailwindInsetPositionValue<TailwindSpacing, Plug>
}

type TailwindTopPositionVariants = "top" | "-top"
type TailwindTopPositionValue<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = `${TailwindTopPositionVariants}-${
    | PositionValueCommonVariants<TailwindSpacing>
    | Pluggable<Plug>}`
export type TailwindTopPositionValueType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    top: TailwindTopPositionValue<TailwindSpacing, Plug>
}

type TailwindBottomPositionVariants = "bottom" | "-bottom"
type TailwindBottomPositionValue<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = `${TailwindBottomPositionVariants}-${
    | PositionValueCommonVariants<TailwindSpacing>
    | Pluggable<Plug>}`
export type TailwindBottomPositionValueType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    bottom: TailwindBottomPositionValue<TailwindSpacing, Plug>
}

type TailwindLeftPositionVariants = "left" | "-left"
type TailwindLeftPositionValue<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = `${TailwindLeftPositionVariants}-${
    | PositionValueCommonVariants<TailwindSpacing>
    | Pluggable<Plug>}`
export type TailwindLeftPositionValueType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    left: TailwindLeftPositionValue<TailwindSpacing, Plug>
}

type TailwindRightPositionVariants = "right" | "-right"
type TailwindRightPositionValue<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = `${TailwindRightPositionVariants}-${
    | PositionValueCommonVariants<TailwindSpacing>
    | Pluggable<Plug>}`
export type TailwindRightPositionValueType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for controlling the placement of positioned elements.
     *@docs [top](https://tailwindcss.com/docs/top-right-bottom-left)
     */
    right: TailwindRightPositionValue<TailwindSpacing, Plug>
}
