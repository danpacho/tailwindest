import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindTextDecorationThicknessVariants =
    | "auto"
    | "from-font"
    | "0"
    | "1"
    | "2"
    | "4"
    | "8"
    | TailwindArbitrary
type TailwindTextDecorationThickness =
    `decoration-${TailwindTextDecorationThicknessVariants}`
export type TailwindTextDecorationThicknessType = {
    /**
     *@note Utilities for controlling the thickness of text decorations.
     *@docs [text-decoration-thickness](https://tailwindcss.com/docs/text-decoration-thickness)
     */
    textDecorationThickness: TailwindTextDecorationThickness
}
