type TailwindListStylePositionVariants = "inside" | "outside"
type TailwindListStylePosition = `list-${TailwindListStylePositionVariants}`
export type TailwindListStylePositionType = {
    /**
     *@description Utilities for controlling the position of bullets/numbers in lists.
     *@see {@link https://tailwindcss.com/docs/list-style-position list style position}
     */
    listStylePosition: TailwindListStylePosition
}
