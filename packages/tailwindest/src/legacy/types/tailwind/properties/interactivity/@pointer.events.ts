type TailwindPointerEventsVariants = "none" | "auto"
type TailwindPointerEvents = `pointer-events-${TailwindPointerEventsVariants}`
export type TailwindPointerEventsType = {
    /**
     *@description Utilities for controlling whether an element responds to pointer events.
     *@see {@link https://tailwindcss.com/docs/pointer-events pointer events}
     */
    pointerEvents: TailwindPointerEvents
}
