type TailwindBackgroundClipVariants = "border" | "padding" | "content" | "text"
type TailwindBackgroundClip = `bg-clip-${TailwindBackgroundClipVariants}`
export type TailwindBackgroundClipType = {
    /**
     *@note Utilities for controlling the bounding box of an element's background.
     *@docs [background-clip](https://tailwindcss.com/docs/background-clip)
     */
    backgroudClip: TailwindBackgroundClip
}
