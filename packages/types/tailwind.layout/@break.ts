type TailwindBreakVariants =
    | "auto"
    | "all"
    | "avoid"
    | "avoid-page"
    | "page"
    | "left"
    | "right"
    | "column"
type TailwindBreakAfter = `break-after-${TailwindBreakVariants}`
type TailwindBreakBefore = `break-before-${TailwindBreakVariants}`

type TailwindBreakInsideVariants =
    | "auto"
    | "avoid"
    | "avoid-page"
    | "avoid-column"
type TailwindBreakInside = `break-inside-${TailwindBreakInsideVariants}`

export type TailwindBreakType = {
    /**
     *@note Utilities for controlling how a column or page should break after an element.
     *@docs [break-after](https://tailwindcss.com/docs/break-after)
     */
    breakAfter: TailwindBreakAfter
    /**
     *@note Utilities for controlling how a column or page should break before an element.
     *@docs [break-before](https://tailwindcss.com/docs/break-before)
     */
    breakBefore: TailwindBreakBefore
    /**
     *@note Utilities for controlling how a column or page should break within an element.
     *@docs [break-inside](https://tailwindcss.com/docs/break-inside)
     */
    breakInside: TailwindBreakInside
}
