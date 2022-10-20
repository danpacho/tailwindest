import { TailwindBackgroundBlendModeType } from "./@background.blend.mode"
import { TailwindBoxShadowType } from "./@box.shadow"
import { TailwindBoxShadowColorType } from "./@box.shadow.color"
import { TailwindMixBlendModeType } from "./@mix.blend.mode"
import { TailwindOpacityType } from "./@opacity"

export interface TailwindEffects<
    TailwindColor extends string,
    EffectsPlug extends {
        boxShadow?: string
        boxShadowColor?: string
    } = {
        boxShadow: ""
        boxShadowColor: ""
    }
> extends TailwindBoxShadowColorType<
            TailwindColor,
            EffectsPlug["boxShadowColor"]
        >,
        TailwindBoxShadowType<EffectsPlug["boxShadow"]>,
        TailwindBackgroundBlendModeType,
        TailwindMixBlendModeType,
        TailwindOpacityType {}
