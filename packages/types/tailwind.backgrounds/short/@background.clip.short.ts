type TailwindBackgroundClipVariants = "border" | "padding" | "content" | "text"
type TailwindBackgroundClip = `bg-clip-${TailwindBackgroundClipVariants}`
export type ShortTailwindBackgroundClipType = {
    /**
     *@description Utilities for controlling the bounding box of an element's background.
     *@see {@link https://tailwindcss.com/docs/background-clip background clip}
     */
    bgClip: TailwindBackgroundClip
}
