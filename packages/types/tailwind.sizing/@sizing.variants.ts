import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

export type SizingVariants<TailwindSpacing extends string> =
    | "auto"
    | "full"
    | "screen"
    | "min"
    | "max"
    | "fit"
    | TailwindSpacing

export type MinSizingVariants =
    | "0"
    | "full"
    | "min"
    | "max"
    | "fit"
    | TailwindArbitrary
