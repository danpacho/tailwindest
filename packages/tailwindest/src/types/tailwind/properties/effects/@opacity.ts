export type TailwindOpacityType<TailwindOpacity extends string> = {
    /**
     *@description Utilities for controlling the opacity of an element.
     *@see {@link https://tailwindcss.com/docs/opacity opacity}
     */
    opacity: `opacity-${TailwindOpacity}`
}
