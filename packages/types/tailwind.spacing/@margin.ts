import { SpacingVariants } from "../tailwind.common/@spacing.varients"

type TailwindMarginVariants = SpacingVariants | "auto"
export type TailwindMarginType = {
    /**
     *@note Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    margin: `m-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginX: `mx-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginY: `my-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginTop: `mt-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginBottom: `mb-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginRight: `mr-${TailwindMarginVariants}`
    /**
     *@note Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginLeft: `ml-${TailwindMarginVariants}`
}
