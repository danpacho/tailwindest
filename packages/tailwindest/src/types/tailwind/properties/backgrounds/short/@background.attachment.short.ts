type TailwindBackgroundAttachmentVariants = "fixed" | "local" | "scroll"
type TailwindBackgroundAttachment = `bg-${TailwindBackgroundAttachmentVariants}`
export type ShortTailwindBackgroundAttachmentType = {
    /**
     *@description Utilities for controlling how a background image behaves when scrolling.
     *@see {@link https://tailwindcss.com/docs/background-attachment background attachment}
     */
    bgAttachment: TailwindBackgroundAttachment
}
