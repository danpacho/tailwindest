import { TailwindSpacingVariants } from "../tailwind.common/@spacing.varients"

export type TailwindScrollPaddingType = {
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPadding: `scroll-p-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container left direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingLeft: `scroll-pl-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container right direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingRight: `scroll-pr-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container top direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingTop: `scroll-pt-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container bottom direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingBottom: `scroll-pb-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingX: `scroll-px-${TailwindSpacingVariants}`
    /**
     *@note Utilities for controlling an element's scroll offset within a snap container y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [scroll-padding](https://tailwindcss.com/docs/scroll-padding)
     */
    scrollPaddingY: `scroll-py-${TailwindSpacingVariants}`
}
