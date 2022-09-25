import { SpacingVarients } from "./@spacing.varients"

type TailwindSpaceBetweenVarients = SpacingVarients | "reverse"
export type TailwindSpaceBetweenType = {
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceX: `space-x-${TailwindSpaceBetweenVarients}`
    /**
     *@note Utilities for controlling the space(**margin**) between child elements `> * + *`.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [space](https://tailwindcss.com/docs/space)
     */
    spaceY: `space-y-${TailwindSpaceBetweenVarients}`
}
