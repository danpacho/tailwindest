import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { TailwindSpacingVariants } from "../tailwind.common/@spacing.varients"

export type SizingVariants =
    | TailwindSpacingVariants
    | TailwindArbitrary
    | "auto"
    | "full"
    | "screen"
    | "min"
    | "max"
    | "fit"

export type MinSizingVariants =
    | "0"
    | "full"
    | "min"
    | "max"
    | "fit"
    | TailwindArbitrary
