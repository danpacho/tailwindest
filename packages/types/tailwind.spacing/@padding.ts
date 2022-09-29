import { SpacingVariants } from "./@spacing.varients"

export type TailwindPaddingType = {
    /**
     *@note Utilities for controlling an element's padding all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    padding: `p-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingX: `px-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingY: `py-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingTop: `pt-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingBottom: `pb-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingRight: `pr-${SpacingVariants}`
    /**
     *@note Utilities for controlling an element's padding left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [padding](https://tailwindcss.com/docs/padding)
     */
    paddingLeft: `pl-${SpacingVariants}`
}
