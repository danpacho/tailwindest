import { SpacingVariants } from "../tailwind.common/@spacing.varients"

export type TailwindBorderSpacingType = {
    /**
     *@note Utilities for controlling the spacing between table borders.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacing: `border-spacing-${SpacingVariants}`
    /**
     *@note Utilities for controlling the spacing between table borders x direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingX: `border-spacing-x-${SpacingVariants}`
    /**
     *@note Utilities for controlling the spacing between table borders y direction.
     *@docs [border-spacing](https://tailwindcss.com/docs/border-spacing)
     */
    borderSpacingY: `border-spacing-y-${SpacingVariants}`
}
