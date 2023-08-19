type TailwindFlexDirectionVariants =
    | "row"
    | "row-reverse"
    | "col"
    | "col-reverse"
type TailwindFlexDirection = `flex-${TailwindFlexDirectionVariants}`
export type TailwindFlexDirectionType = {
    /**
     *@description Utilities for controlling the direction of flex items.
     *@see {@link https://tailwindcss.com/docs/flex-direction flex direction}
     */
    flexDirection: TailwindFlexDirection
}
