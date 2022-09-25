type TailwindGridPlaceItemsVarients = "start" | "end" | "center" | "stretch"
type TailwindGridPlaceItems = `place-item-${TailwindGridPlaceItemsVarients}`
export type TailwindGridPlaceItemsType = {
    /**
     *@note Utilities for controlling how items are justified and aligned at the same time.
     *@docs [place-item](https://tailwindcss.com/docs/place-item)
     */
    placeItem: TailwindGridPlaceItems
}

type TailwindGridPlaceContentVarients =
    | TailwindGridPlaceItemsVarients
    | "between"
    | "around"
    | "evenly"
type TailwindGridPlaceContent =
    `place-content-${TailwindGridPlaceContentVarients}`
export type TailwindGridPlaceContentType = {
    /**
     *@note Utilities for controlling how content is justified and aligned at the same time.
     *@docs [place-content](https://tailwindcss.com/docs/place-content)
     */
    placeContent: TailwindGridPlaceContent
}

type TailwindGridPlaceSelfVarients = "auto" | TailwindGridPlaceItemsVarients
type TailwindGridPlaceSelf = `place-self-${TailwindGridPlaceSelfVarients}`
export type TailwindGridPlaceSelfType = {
    /**
     *@note Utilities for controlling how an individual item is justified and aligned at the same time.
     *@docs [place-self](https://tailwindcss.com/docs/place-self)
     */
    placeSelf: TailwindGridPlaceSelf
}
