type TailwindSkewVariants = "0" | "1" | "2" | "3" | "6" | "12"
export type TailwindSkewType = {
    /**
     *@note Utilities for skewing elements with transform x direction
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewX:
        | `skew-x-${TailwindSkewVariants}`
        | `-skew-x-${TailwindSkewVariants}`
    /**
     *@note Utilities for skewing elements with transform y direction
     *@unit Gap `1` = `1deg`
     *@docs [skew](https://tailwindcss.com/docs/skew)
     */
    transformSkewY:
        | `skew-y-${TailwindSkewVariants}`
        | `-skew-y-${TailwindSkewVariants}`
}
