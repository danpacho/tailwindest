type TailwindBackgroundClipVariants = "border" | "padding" | "content" | "text"
type TailwindBackgroundClip = `bg-clip-${TailwindBackgroundClipVariants}`
export type TailwindBackgroundClipType = {
    /**
     *@description Utilities for controlling the bounding box of an element's background.
     *@see {@link https://tailwindcss.com/docs/background-clip background clip}
     */
    backgroudClip: TailwindBackgroundClip
}
