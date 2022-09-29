type TailwindFontFamilyVariants = "sans" | "serif" | "mono"
type TailwindFontFamily = `font-${TailwindFontFamilyVariants}`
export type TailwindFontFamilyType = {
    /**
     *@note Utilities for controlling the font family of an element.
     *@docs [font-family](https://tailwindcss.com/docs/font-family)
     */
    fontFamily: TailwindFontFamily
}
