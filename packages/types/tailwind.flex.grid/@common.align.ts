import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindAlignContentVarients =
    | "center"
    | "start"
    | "end"
    | "between"
    | "around"
    | "evenly"
type TailwindAlignContent = `content-${TailwindAlignContentVarients}`
export type TailwindAlignContentType = {
    /**
     *@note Utilities for controlling how rows are positioned in multi-row flex and grid containers.
     *@docs [align-content](https://tailwindcss.com/docs/align-content)
     */
    alignContent: TailwindAlignContent
}

type TailwindAlignItemsVarients =
    | "start"
    | "end"
    | "center"
    | "baseline"
    | "stretch"
type TailwindAlignItems = `items-${TailwindAlignItemsVarients}`
export type TailwindAlignItemsType = {
    /**
     *@note Utilities for controlling how flex and grid items are positioned along a container's cross axis.
     *@docs [align-items](https://tailwindcss.com/docs/align-items)
     */
    alignItems: TailwindAlignItems
}

type TailwindAlignSelfVarients =
    | "auto"
    | TailwindAlignItemsVarients
    | TailwindArbitrary
type TailwindAlignSelf = `self-${TailwindAlignSelfVarients}`
export type TailwindAlignSelfType = {
    /**
     *@note Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.
     *@docs [align-self](https://tailwindcss.com/docs/align-self)
     */
    alignSelf: TailwindAlignSelf
}
