import { TailwindSpacingVariants } from "../tailwind.common/@spacing.varients"

type TailwindSpaceBetweenVariants = TailwindSpacingVariants | "reverse"
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
