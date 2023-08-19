type TailwindGridAutoFlowVariants =
    | "row"
    | "col"
    | "dense"
    | "row-dense"
    | "col-dense"

type TailwindGridAutoFlow = `grid-flow-${TailwindGridAutoFlowVariants}`
export type TailwindGridAutoFlowType = {
    /**
     *@description Utilities for controlling how elements in a grid are auto-placed.
     *@see {@link https://tailwindcss.com/docs/grid-auto-flow grid auto flow}
     */
    gridAutoFlow: TailwindGridAutoFlow
}
