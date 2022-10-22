import { ToPluginWithTitle } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { TailwindAnimationType } from "./@animation"
import { TailwindTransitionType } from "./@transition"

type TailwindTransitionPropertyVariants =
    | "none"
    | "all"
    | "colors"
    | "opacity"
    | "shadow"
    | "transform"
    | TailwindArbitrary

type TailwindTransitionTimingFunctionVariants =
    | "in"
    | "out"
    | "linear"
    | "in-out"
    | TailwindArbitrary

type TailwindTransitionDurationVariants =
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | TailwindArbitrary

type TailwindTransitionDelayVariants =
    | "75"
    | "100"
    | "150"
    | "200"
    | "300"
    | "500"
    | "700"
    | "1000"
    | TailwindArbitrary

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
        TailwindTransitionType<
            | ToPluginWithTitle<
                  "transition",
                  TailwindTransitionPropertyVariants,
                  TransitionAnimationPlug["transitionProperty"]
              >
            | "transition",
            ToPluginWithTitle<
                "duration",
                TailwindTransitionDurationVariants,
                TransitionAnimationPlug["transitionDuration"]
            >,
            ToPluginWithTitle<
                "ease",
                TailwindTransitionTimingFunctionVariants,
                TransitionAnimationPlug["transitionTimingFunction"]
            >,
            ToPluginWithTitle<
                "delay",
                TailwindTransitionDelayVariants,
                TransitionAnimationPlug["transitionDelay"]
            >
        > {}
