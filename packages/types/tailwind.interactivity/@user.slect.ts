type TailwindUserSlectVariants = "none" | "text" | "all" | "auto"
type TailwindUserSlect = `slect-${TailwindUserSlectVariants}`
export type TailwindUserSlectType = {
    /**
     *@note Utilities for controlling whether the user can select text in an element.
     *@docs [user-slect](https://tailwindcss.com/docs/user-slect)
     */
    userSlect: TailwindUserSlect
}
