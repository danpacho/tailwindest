type TailwindBackgroundAttachmentVariants = "fixed" | "local" | "scroll"
type TailwindBackgroundAttachment = `bg-${TailwindBackgroundAttachmentVariants}`
export type TailwindBackgroundAttachmentType = {
    /**
     *@note Utilities for controlling how a background image behaves when scrolling.
     *@docs [background-attachment](https://tailwindcss.com/docs/background-attachment)
     */
    backgroundAttachment: TailwindBackgroundAttachment
}
