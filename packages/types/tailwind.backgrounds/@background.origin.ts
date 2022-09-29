type TailwindBackgroundOriginVariants = "border" | "padding" | "content"
type TailwindBackgroundOrigin = `bg-origin-${TailwindBackgroundOriginVariants}`
export type TailwindBackgroundOriginType = {
    /**
     *@note Utilities for controlling how an element's background is positioned relative to borders, padding, and content.
     *@docs [background-origin](https://tailwindcss.com/docs/background-origin)
     */
    backgroundOrigin: TailwindBackgroundOrigin
}
