type TailwindTouchActionVariants =
    | "auto"
    | "none"
    | "pan-x"
    | "pan-left"
    | "pan-right"
    | "pan-y"
    | "pan-up"
    | "pan-down"
    | "pinch-zoom"
    | "manipulation"
type TailwindTouchAction = `touch-${TailwindTouchActionVariants}`
export type TailwindTouchActionType = {
    /**
     *@description Utilities for controlling how an element can be scrolled and zoomed on touchscreens.
     *@see {@link https://tailwindcss.com/docs/touch-action touch action}
     */
    touchAction: TailwindTouchAction
}
