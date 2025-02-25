import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "../common/@arbitrary"

type TailwindListStyleImageVariants<Plug extends PlugBase = ""> =
    | "none"
    | Pluggable<Plug>
    | TailwindArbitrary
type TailwindListStyleImage<Plug extends PlugBase = ""> =
    `list-image-${TailwindListStyleImageVariants<Plug>}`

export type TailwindListStyleImageType<Plug extends PlugBase = ""> = {
    /**
     *@description Utilities for controlling the marker images for list items.
     *@see {@link https://tailwindcss.com/docs/list-style-image list style image}
     */
    listStyleImage: TailwindListStyleImage<Plug>
}
