type TailwindListStyleTypeVariants = "none" | "disc" | "decimal"
type TailwindListStyleType = `list-${TailwindListStyleTypeVariants}`
export type TailwindListStyleTypeType = {
    /**
     *@note Utilities for controlling the bullet/number style of a list.
     *@docs [list-style-type](https://tailwindcss.com/docs/list-style-type)
     */
    listStyleType: TailwindListStyleType
}
