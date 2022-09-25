import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindAsepectRatio =
    | "aspect-auto"
    | "aspect-square"
    | "aspect-video"
    | TailwindArbitrary
export type TailwindAsepectRatioType = {
    /**
     *@note Utilities for controlling the aspect ratio of an element.
     *@docs [aspect-ratio](https://tailwindcss.com/docs/aspect-ratio)
     */
    aspectRatio: TailwindAsepectRatio
}
