type TailwindBackgroundOriginVariants = "border" | "padding" | "content"
type TailwindBackgroundOrigin = `bg-origin-${TailwindBackgroundOriginVariants}`
export type ShortTailwindBackgroundOriginType = {
    /**
     *@description Utilities for controlling how an element's background is positioned relative to borders, padding, and content.
     *@see {@link https://tailwindcss.com/docs/background-origin background origin}
     */
    bgOrigin: TailwindBackgroundOrigin
}
