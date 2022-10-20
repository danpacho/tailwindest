export type TailwindBorderStyleVariants =
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "hidden"
    | "none"

type TailwindBorderStyle = `border-${TailwindBorderStyleVariants}`
export type TailwindBorderStyleType = {
    /**
     *@note Utilities for controlling the style of an element's borders.
     *@docs [border-style](https://tailwindcss.com/docs/border-style)
     */
    borderStyle: TailwindBorderStyle
}

type TailwindDivideStyle = `divide-${TailwindBorderStyleVariants}`
export type TailwindDivideStyleType = {
    /**
     *@note Utilities for controlling the border style between elements.
     *@docs [divide-style](https://tailwindcss.com/docs/divide-style)
     */
    divideStyle: TailwindDivideStyle
}
