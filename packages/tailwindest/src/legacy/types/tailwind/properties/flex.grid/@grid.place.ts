type TailwindGridPlaceItemsVariants = "start" | "end" | "center" | "stretch"
type TailwindGridPlaceItems = `place-items-${TailwindGridPlaceItemsVariants}`
export type TailwindGridPlaceItemsType = {
    /**
     *@description Utilities for controlling how items are justified and aligned at the same time.
     *@see {@link https://tailwindcss.com/docs/place-items place items}
     */
    placeItems: TailwindGridPlaceItems
}

type TailwindGridPlaceContentVariants =
    | TailwindGridPlaceItemsVariants
    | "between"
    | "around"
    | "evenly"
type TailwindGridPlaceContent =
    `place-content-${TailwindGridPlaceContentVariants}`
export type TailwindGridPlaceContentType = {
    /**
     *@description Utilities for controlling how content is justified and aligned at the same time.
     *@see {@link https://tailwindcss.com/docs/place-content place content}
     */
    placeContent: TailwindGridPlaceContent
}

type TailwindGridPlaceSelfVariants = "auto" | TailwindGridPlaceItemsVariants
type TailwindGridPlaceSelf = `place-self-${TailwindGridPlaceSelfVariants}`
export type TailwindGridPlaceSelfType = {
    /**
     *@description Utilities for controlling how an individual item is justified and aligned at the same time.
     *@see {@link https://tailwindcss.com/docs/place-self place self}
     */
    placeSelf: TailwindGridPlaceSelf
}
