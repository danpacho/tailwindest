type TailwindUserSlectVariants = "none" | "text" | "all" | "auto"
type TailwindUserSlect = `slect-${TailwindUserSlectVariants}`
export type TailwindUserSlectType = {
    /**
     *@description Utilities for controlling whether the user can select text in an element.
     *@see {@link https://tailwindcss.com/docs/user-slect user slect}
     */
    userSlect: TailwindUserSlect
}
