import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { TailwindSpacingVariants } from "./../tailwind.common/@spacing.varients"

type TailwindTranslateVariants =
    | TailwindSpacingVariants
    | TailwindArbitrary
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"
export type TailwindTranslateType = {
    /**
     *@note Utilities for translating elements with transform.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslate:
        | `translate-${TailwindTranslateVariants}`
        | `-translate-${TailwindTranslateVariants}`
    /**
     *@note Utilities for translating elements with transform x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateX:
        | `translate-x-${TailwindTranslateVariants}`
        | `-translate-x-${TailwindTranslateVariants}`
    /**
     *@note Utilities for translating elements with transform y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateY:
        | `translate-y-${TailwindTranslateVariants}`
        | `-translate-y-${TailwindTranslateVariants}`
}
