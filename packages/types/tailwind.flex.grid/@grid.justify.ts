type TailwindGridJustifyItemsVariants = "start" | "end" | "center" | "stretch"
type TailwindGridJustifyItems =
    `justify-items-${TailwindGridJustifyItemsVariants}`
export type TailwindGridJustifyItemsType = {
    /**
     *@note Utilities for controlling how grid items are aligned along their inline axis.
     *@docs [justify-items](https://tailwindcss.com/docs/justify-items)
     */
    justifyItems: TailwindGridJustifyItems
}

type TailwindGridJustifySelfVariants = "auto" | TailwindGridJustifyItemsVariants
type TailwindGridJustifySelf = `justify-self-${TailwindGridJustifySelfVariants}`
export type TailwindGridJustifySelfType = {
    /**
     *@note Utilities for controlling how an individual grid item is aligned along its inline axis.
     *@docs [justify-self](https://tailwindcss.com/docs/justify-self)
     */
    justifySelf: TailwindGridJustifySelf
}
