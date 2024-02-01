import type {
    TailwindBackgroundPlug,
    TailwindBordersPlug,
    TailwindEffectsPlug,
    TailwindFiltersPlug,
    TailwindFlexGridPlug,
    TailwindFontPlug,
    TailwindInteractivityPlug,
    TailwindLayoutPlug,
    TailwindSizingPlug,
    TailwindSpacingPlug,
    TailwindSvgPlug,
    TailwindTablesPlug,
    TailwindTransformsPlug,
    TailwindTransitionAnimationPlug,
} from "../properties"

/**
 * @description Global style supported list
 * @see {@link https://tailwindcss.com/docs/theme#configuration-reference configuration reference}
 */
export type TailwindGlobalPluginKey = "color" | "opacity" | "sizing"

/**
 * @description Style supported list
 * @see {@link https://tailwindcss.com/docs/theme#configuration-reference configuration reference}
 */
export type TailwindStylePluginKey =
    // aria attributes
    | "aria"
    | Exclude<keyof TailwindBackgroundPlug, "gradientColorStops">
    | keyof TailwindTransitionAnimationPlug
    | keyof TailwindTransformsPlug
    | keyof TailwindTablesPlug
    | keyof TailwindSvgPlug
    | keyof TailwindSpacingPlug
    | keyof TailwindLayoutPlug
    | keyof TailwindBordersPlug
    | keyof TailwindEffectsPlug
    | keyof TailwindFiltersPlug
    | keyof TailwindFlexGridPlug
    | keyof TailwindFontPlug
    | keyof TailwindInteractivityPlug
    | keyof TailwindSizingPlug
