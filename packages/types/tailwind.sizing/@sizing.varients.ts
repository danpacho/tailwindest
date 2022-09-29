import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { SpacingVariants } from "../tailwind.spacing/@spacing.varients"

export type SizingVariants =
    | SpacingVariants
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
