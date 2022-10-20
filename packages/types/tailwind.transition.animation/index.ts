import { TailwindAnimationType } from "./@animation"
import { TailwindTransitionType } from "./@transition"
import { TailwindTransitionDelayType } from "./@transition.delay"
import { TailwindTransitionDurationType } from "./@transition.duration"
import { TailwindTransitionPropertyType } from "./@transition.property"
import { TailwindTransitionTimingFunctionType } from "./@transition.timing.function"
export interface TailwindTransitionAnimation<
    TransitionAnimationPlug extends {
        animation?: string
        transitionDelay?: string
        transitionDuration?: string
        transitionProperty?: string
        transitionTimingFunction?: string
    } = {
        animation: ""
        transitionDelay: ""
        transitionDuration: ""
        transitionProperty: ""
        transitionTimingFunction: ""
    }
> extends TailwindAnimationType<TransitionAnimationPlug["animation"]>,
        TailwindTransitionDelayType<TransitionAnimationPlug["transitionDelay"]>,
        TailwindTransitionDurationType<
            TransitionAnimationPlug["transitionDuration"]
        >,
        TailwindTransitionPropertyType<
            TransitionAnimationPlug["transitionProperty"]
        >,
        TailwindTransitionTimingFunctionType<
            TransitionAnimationPlug["transitionTimingFunction"]
        >,
        TailwindTransitionType<
            TransitionAnimationPlug["transitionProperty"],
            TransitionAnimationPlug["transitionDuration"],
            TransitionAnimationPlug["transitionTimingFunction"]
        > {}
