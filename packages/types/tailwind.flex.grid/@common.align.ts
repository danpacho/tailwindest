import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindAlignContentVariants =
    | "center"
    | "start"
    | "end"
    | "between"
    | "around"
    | "evenly"
type TailwindAlignContent = `content-${TailwindAlignContentVariants}`
export type TailwindAlignContentType = {
    /**
     *@description Utilities for controlling how rows are positioned in multi-row flex and grid containers.
     *@see {@link https://tailwindcss.com/docs/align-content align content}
     */
    alignContent: TailwindAlignContent
}

type TailwindAlignItemsVariants =
    | "start"
    | "end"
    | "center"
    | "baseline"
    | "stretch"
type TailwindAlignItems = `items-${TailwindAlignItemsVariants}`
export type TailwindAlignItemsType = {
    /**
     *@description Utilities for controlling how flex and grid items are positioned along a container's cross axis.
     *@see {@link https://tailwindcss.com/docs/align-items align items}
     */
    alignItems: TailwindAlignItems
}

type TailwindAlignSelfVariants =
    | "auto"
    | TailwindAlignItemsVariants
    | TailwindArbitrary
type TailwindAlignSelf = `self-${TailwindAlignSelfVariants}`
export type TailwindAlignSelfType = {
    /**
     *@description Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.
     *@see {@link https://tailwindcss.com/docs/align-self align self}
     */
    alignSelf: TailwindAlignSelf
}
