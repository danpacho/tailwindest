import { TailwindColor } from "../tailwind.common/@color"

type TailwindTextDecorationColor = `decoration-${TailwindColor}`
export type TailwindTextDecorationColorType = {
    /**
     *@note Utilities for controlling the color of text decorations.
     *@docs [text-decoration](https://tailwindcss.com/docs/text-decoration)
     */
    textDecorationColor: TailwindTextDecorationColor
}
