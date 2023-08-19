type TailwindCaptionSideVariants = "top" | "bottom"
type TailwindCaptionSide = `caption-${TailwindCaptionSideVariants}`

export type TailwindCaptionSideType = {
    /**
     *@description Utilities for controlling the alignment of a caption element inside of a table.
     *@see {@link https://tailwindcss.com/docs/caption-side caption side}
     */
    captionSide: TailwindCaptionSide
}
