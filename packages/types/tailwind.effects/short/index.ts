import { TailwindBoxShadowType } from "../@box.shadow"
import { TailwindBoxShadowColorType } from "../@box.shadow.color"
import { TailwindMixBlendModeType } from "../@mix.blend.mode"
import { TailwindOpacityType } from "../@opacity"
import { ShortTailwindBackgroundBlendModeType } from "./@background.blend.mode.short"

export interface ShortTailwindEffects<
    TailwindColor extends string,
    TailwindOpacity extends string,
    EffectsPlug extends {
        boxShadow?: string
        boxShadowColor?: string
    } = {
        boxShadow: ""
        boxShadowColor: ""
    }
> extends TailwindOpacityType<TailwindOpacity>,
        TailwindBoxShadowColorType<
            TailwindColor,
            EffectsPlug["boxShadowColor"]
        >,
        TailwindBoxShadowType<EffectsPlug["boxShadow"]>,
        TailwindMixBlendModeType,
        ShortTailwindBackgroundBlendModeType {}
