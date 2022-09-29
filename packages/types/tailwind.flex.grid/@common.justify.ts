type TailwindJustifyContentVariants =
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
type TailwindJustifyContent = `justify-${TailwindJustifyContentVariants}`
export type TailwindJustifyContentType = {
    /**
     *@note Utilities for controlling how flex and grid items are positioned along a container's main axis.
     *@docs [justify-content](https://tailwindcss.com/docs/justify-content)
     */
    justifyContent: TailwindJustifyContent
}
