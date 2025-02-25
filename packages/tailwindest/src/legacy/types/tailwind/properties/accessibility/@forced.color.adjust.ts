type TailwindForcedColorAdjust = "auto" | "none"
export type TailwindForcedColorAdjustType = {
    /**
     *@description Utilities for opting in and out of forced colors.
     *@see {@link https://tailwindcss.com/docs/forced-color-adjust forced color adjust}
     */
    forcedColorAdjust: `forced-color-adjust-${TailwindForcedColorAdjust}`
}
