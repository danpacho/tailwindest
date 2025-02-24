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
     *@description Utilities for controlling how flex and grid items are positioned along a container's main axis.
     *@see {@link https://tailwindcss.com/docs/justify-content justify content}
     */
    justifyContent: TailwindJustifyContent
}
