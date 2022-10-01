type TailwindPointerEventsVariants = "none" | "auto"
type TailwindPointerEvents = `pointer-events-${TailwindPointerEventsVariants}`
export type TailwindPointerEventsType = {
    /**
     *@note Utilities for controlling whether an element responds to pointer events.
     *@docs [pointer-events](https://tailwindcss.com/docs/pointer-events)
     */
    pointerEvents: TailwindPointerEvents
}
