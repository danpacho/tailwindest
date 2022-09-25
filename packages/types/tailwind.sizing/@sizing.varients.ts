import { TailwindArbitrary } from "../tailwind.arbitrary"
import { SpacingVarients } from "../tailwind.spacing/@spacing.varients"

export type SizingVarients =
    | SpacingVarients
    | TailwindArbitrary
    | "auto"
    | "full"
    | "screen"
    | "min"
    | "max"
    | "fit"

export type MinSizingVarients =
    | "0"
    | "full"
    | "min"
    | "max"
    | "fit"
    | TailwindArbitrary
