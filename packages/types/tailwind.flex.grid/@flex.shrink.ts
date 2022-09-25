import { TailwindArbitrary } from "../tailwind.arbitrary"

type TailwindFlexShrink = "shrink" | "shrink-0" | `shirink-${TailwindArbitrary}`
export type TailwindFlexShrinkType = {
    /**
     *@note Utilities for controlling how flex items shrink.
     *@docs [flex-shrink](https://tailwindcss.com/docs/flex-shrink)
     */
    flexShrink: TailwindFlexShrink
}
