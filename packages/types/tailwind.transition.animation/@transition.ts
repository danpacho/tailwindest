import { TailwindTransitionDurationType } from "./@transition.duration"
import { TailwindTransitionPropertyType } from "./@transition.property"
import { TailwindTransitionTimingFunctionType } from "./@transition.timing.function"

type TailwindTransition =
    `${TailwindTransitionPropertyType["transitionProperty"]} ${TailwindTransitionDurationType["transitionDuration"]} ${TailwindTransitionTimingFunctionType["transitionTimingFunction"]}`
export type TailwindTransitionType = {
    /**
     *@note `CSS` [shorthand syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions#defining_transitions)
     *@note `<property>` `<duration>` `<timing>`
     *@docs [transition](https://tailwindcss.com/docs/transition-property)
     */
    transition: "transition" | TailwindTransition
}
