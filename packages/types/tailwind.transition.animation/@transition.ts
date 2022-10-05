import { TailwindTransitionDurationType } from "./@transition.duration"
import { TailwindTransitionPropertyType } from "./@transition.property"
import { TailwindTransitionTimingFunctionType } from "./@transition.timing.function"

type TailwindTransition =
    `${TailwindTransitionPropertyType["transitionProperty"]} ${TailwindTransitionDurationType["transitionDuration"]} ${TailwindTransitionTimingFunctionType["transitionTimingFunction"]}`
export type TailwindTransitionType = {
    /**
     *@note transition shorthand syntax `<property>` `<duration>` `<timing>`
     *@docs [transition](https://tailwindcss.com/docs/transition-property)
     */
    transition: "transition" | TailwindTransition
}
