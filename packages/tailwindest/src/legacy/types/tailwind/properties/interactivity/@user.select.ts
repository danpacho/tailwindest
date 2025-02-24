type TailwindUserSelectVariants = "none" | "text" | "all" | "auto"
type TailwindUserSelect = `select-${TailwindUserSelectVariants}`
export type TailwindUserSelectType = {
    /**
     *@description Utilities for controlling whether the user can select text in an element.
     *@see {@link https://tailwindcss.com/docs/user-select user select}
     */
    userSelect: TailwindUserSelect
}
