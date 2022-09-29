import { SpacingVariants } from "./@spacing.varients"

type TailwindSpaceBetweenVariants = SpacingVariants | "reverse"
export type TailwindSpaceBetweenType = {
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceX: `space-x-${TailwindSpaceBetweenVariants}`
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceY: `space-y-${TailwindSpaceBetweenVariants}`
}
