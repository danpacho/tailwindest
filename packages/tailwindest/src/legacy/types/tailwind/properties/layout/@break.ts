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
     *@description Utilities for controlling how a column or page should break after an element.
     *@see {@link https://tailwindcss.com/docs/break-after break after}
     */
    breakAfter: TailwindBreakAfter
    /**
     *@description Utilities for controlling how a column or page should break before an element.
     *@see {@link https://tailwindcss.com/docs/break-before break before}
     */
    breakBefore: TailwindBreakBefore
    /**
     *@description Utilities for controlling how a column or page should break within an element.
     *@see {@link https://tailwindcss.com/docs/break-inside break inside}
     */
    breakInside: TailwindBreakInside
}
