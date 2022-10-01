import { TailwindAnimationType } from "./@animation"
import { TailwindTransitionType } from "./@transition"
import { TailwindTransitionDelayType } from "./@transition.delay"
import { TailwindTransitionDurationType } from "./@transition.duration"
import { TailwindTransitionPropertyType } from "./@transition.property"
import { TailwindTransitionTimingFunctionType } from "./@transition.timing.function"
export interface TailwindTransitionAnimation
    extends TailwindAnimationType,
        TailwindTransitionType,
        TailwindTransitionDelayType,
        TailwindTransitionDurationType,
        TailwindTransitionPropertyType,
        TailwindTransitionTimingFunctionType {}
