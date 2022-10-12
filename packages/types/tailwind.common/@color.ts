import { TailwindColorAccent, TailwindColorAccentWithOpacity } from "./@accent"
import {
    TailwindColorVariants,
    TailwindColorWithNoVariants,
} from "./@color.variants"

export type TailwindColor =
    | TailwindColorWithNoVariants
    | TailwindColorAccentWithOpacity
    | `${TailwindColorVariants}-${TailwindColorAccent}`
