import { TailwindColorAccent } from "./@accent"
import {
    TailwindColorVariants,
    TailwindColorWithNoVariants,
} from "./@color.variants"

export type TailwindColor =
    | TailwindColorWithNoVariants
    | `${TailwindColorVariants}-${TailwindColorAccent}`
