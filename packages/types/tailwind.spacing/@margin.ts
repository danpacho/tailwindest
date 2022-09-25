import { SpacingVarients } from "./@spacing.varients"

type TailwindMarginVarients = SpacingVarients | "auto"
export type TailwindMarginType = {
    /**
     *@note Utilities for controlling an element's margin all.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    margin: `m-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin x.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginX: `mx-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin y.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginY: `my-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin top.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginTop: `mt-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin bottom.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginBottom: `mb-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin right.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginRight: `mr-${TailwindMarginVarients}`
    /**
     *@note Utilities for controlling an element's margin left.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [margin](https://tailwindcss.com/docs/margin)
     */
    marginLeft: `ml-${TailwindMarginVarients}`
}
