type TailwindGridJustifyItemsVariants = "start" | "end" | "center" | "stretch"
type TailwindGridJustifyItems =
    `justify-items-${TailwindGridJustifyItemsVariants}`
export type TailwindGridJustifyItemsType = {
    /**
     *@description Utilities for controlling how grid items are aligned along their inline axis.
     *@see {@link https://tailwindcss.com/docs/justify-items justify items}
     */
    justifyItems: TailwindGridJustifyItems
}

type TailwindGridJustifySelfVariants = "auto" | TailwindGridJustifyItemsVariants
type TailwindGridJustifySelf = `justify-self-${TailwindGridJustifySelfVariants}`
export type TailwindGridJustifySelfType = {
    /**
     *@description Utilities for controlling how an individual grid item is aligned along its inline axis.
     *@see {@link https://tailwindcss.com/docs/justify-self justify self}
     */
    justifySelf: TailwindGridJustifySelf
}
