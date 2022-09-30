import { SpacingVariants } from "../tailwind.common/@spacing.varients"

type TailwindTextIndent = `indent-${SpacingVariants}`
export type TailwindTextIndentType = {
    /**
     *@note Utilities for controlling the amount of empty space shown before text in a block.
     *@docs [text-indent](https://tailwindcss.com/docs/text-indent)
     */
    textIndent: TailwindTextIndent
}
