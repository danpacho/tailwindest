import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindContrastVariants<Plug extends PlugBase = ""> = Pluggable<
    "0" | "50" | "75" | "100" | "125" | "150" | "200" | TailwindArbitrary | Plug
>
type TailwindContrast<Plug extends PlugBase = ""> =
    `contrast-${TailwindContrastVariants<Plug>}`
export type TailwindContrastType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for applying contrast filters to an element.
     *@see {@link https://tailwindcss.com/docs/contrast contrast}
     */
    filterContrast: TailwindContrast<Plug>
}
