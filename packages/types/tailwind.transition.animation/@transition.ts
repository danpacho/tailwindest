import { PlugBase } from "../plugin"
import { TailwindTransitionDurationType } from "./@transition.duration"
import { TailwindTransitionPropertyType } from "./@transition.property"
import { TailwindTransitionTimingFunctionType } from "./@transition.timing.function"

type TailwindTransition<
    TransitionPropertyPlug extends PlugBase = "",
    TransitionDurationPlug extends PlugBase = "",
    TransitionTimingFunctionPlug extends PlugBase = ""
> = `${TailwindTransitionPropertyType<TransitionPropertyPlug>["transitionProperty"]} ${TailwindTransitionDurationType<TransitionDurationPlug>["transitionDuration"]} ${TailwindTransitionTimingFunctionType<TransitionTimingFunctionPlug>["transitionTimingFunction"]}`

export type TailwindTransitionType<
    TransitionPropertyPlug extends PlugBase = "",
    TransitionDurationPlug extends PlugBase = "",
    TransitionTimingFunctionPlug extends PlugBase = ""
> = {
    /**
     *@note `CSS` [shorthand syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions#defining_transitions)
     *@note `<property>` `<duration>` `<timing>`
     *@docs [transition](https://tailwindcss.com/docs/transition-property)
     */
    transition:
        | "transition"
        | TailwindTransition<
              TransitionPropertyPlug,
              TransitionDurationPlug,
              TransitionTimingFunctionPlug
          >
}
