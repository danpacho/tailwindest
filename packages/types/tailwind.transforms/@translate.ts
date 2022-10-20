import { PlugBase, Pluggable } from "../plugin"

type TailwindTranslateVariants<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> =
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"
    | TailwindSpacing
    | Pluggable<Plug>

export type TailwindTranslateType<
    TailwindSpacing extends string,
    Plug extends PlugBase = ""
> = {
    /**
     *@note Utilities for translating elements with transform.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslate:
        | `translate-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
        | `-translate-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for translating elements with transform x direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateX:
        | `translate-x-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
        | `-translate-x-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
    /**
     *@note Utilities for translating elements with transform y direction.
     *@unit Gap `1` = `4px` = `0.25rem`
     *@docs [translate](https://tailwindcss.com/docs/translate)
     */
    transformTranslateY:
        | `translate-y-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
        | `-translate-y-${TailwindTranslateVariants<TailwindSpacing, Plug>}`
}
