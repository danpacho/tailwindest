type TailwindBackgroundImageVariants =
    | "t"
    | "tr"
    | "r"
    | "br"
    | "b"
    | "bl"
    | "l"
    | "tl"
type TailwindBackgroundImage =
    | "bg-none"
    | `bg-gradient-to-${TailwindBackgroundImageVariants}`
export type TailwindBackgroundImageType = {
    /**
     *@note Utilities for controlling an element's background image.
     *@docs [background-image](https://tailwindcss.com/docs/background-image)
     */
    backgroundImage: TailwindBackgroundImage
}
