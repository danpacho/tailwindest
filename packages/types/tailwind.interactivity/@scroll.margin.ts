import { TailwindSpacingVariants } from "../tailwind.common/@spacing.varients"

export type TailwindScrollMarginType = {
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMargin: `scroll-m-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginLeft: `scroll-ml-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginRight: `scroll-mr-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginTop: `scroll-mt-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginBottom: `scroll-mb-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginX: `scroll-mx-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling the scroll offset around items in a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-margin](https://tailwindcss.com/docs/scroll-margin)
     */
    scrollMarginY: `scroll-my-${TailwindSpacingVariants}`
}
