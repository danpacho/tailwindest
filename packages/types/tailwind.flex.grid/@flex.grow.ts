import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFlexGrow = "grow" | "grow-0" | `grow-${TailwindArbitrary}`
export type TailwindFlexGrowType = {
    /**
     *@note Utilities for controlling how flex items grow.
     *@docs [flex-grow](https://tailwindcss.com/docs/flex-grow)
     */
    flexGrow: TailwindFlexGrow
}
