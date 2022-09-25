type TailwindObjectPositionVarients =
    | "top"
    | "center"
    | "bottom"
    | "left"
    | "left-top"
    | "left-bottom"
    | "right"
    | "right-top"
    | "right-bottom"

type TailwindObjectPosition = `object-${TailwindObjectPositionVarients}`
export type TailwindObjectPositionType = {
    /**
     *@note Utilities for controlling how a replaced element's content should be positioned within its container.
     *@docs [object-position](https://tailwindcss.com/docs/object-position)
     */
    objectPosition: TailwindObjectPosition
}
