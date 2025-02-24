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
     *@description Utilities for controlling the style of an element's borders.
     *@see {@link https://tailwindcss.com/docs/border-style border style}
     */
    borderStyle: TailwindBorderStyle
}

type TailwindDivideStyle = `divide-${TailwindBorderStyleVariants}`
export type TailwindDivideStyleType = {
    /**
     *@description Utilities for controlling the border style between elements.
     *@see {@link https://tailwindcss.com/docs/divide-style divide style}
     */
    divideStyle: TailwindDivideStyle
}
