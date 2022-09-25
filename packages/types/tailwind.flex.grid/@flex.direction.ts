type TailwindFlexDirectionVarients =
    | "row"
    | "row-reverse"
    | "col"
    | "col-reverse"
type TailwindFlexDirection = `flex-${TailwindFlexDirectionVarients}`
export type TailwindFlexDirectionType = {
    /**
     *@note Utilities for controlling the direction of flex items.
     *@docs [flex-direction](https://tailwindcss.com/docs/flex-direction)
     */
    flexDirection: TailwindFlexDirection
}
