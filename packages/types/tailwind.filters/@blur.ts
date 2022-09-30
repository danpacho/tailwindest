import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBlurVariants =
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | TailwindArbitrary
type TailwindBlur = "blur" | `blur-${TailwindBlurVariants}`
export type TailwindBlurType = {
    /**
     *@note Utilities for applying blur filters to an element.
     *@docs [blur](https://tailwindcss.com/docs/blur)
     */
    filterBlur: TailwindBlur
}

type TailwindBackdropBlur = `backdrop-blur-${TailwindBlurVariants}`
export type TailwindBackdropBlurType = {
    /**
     *@note
     *@docs [backdrop-blur](https://tailwindcss.com/docs/backdrop-blur)
     */
    backdropBlur: TailwindBackdropBlur
}
