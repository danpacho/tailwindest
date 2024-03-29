import { TailwindBackgroundBlendModeType } from "./@background.blend.mode"
import { TailwindBoxShadowType } from "./@box.shadow"
import { TailwindBoxShadowColorType } from "./@box.shadow.color"
import { TailwindMixBlendModeType } from "./@mix.blend.mode"
import { TailwindOpacityType } from "./@opacity"

export interface TailwindEffectsPlug {
    boxShadow?: string
    boxShadowColor?: string
}

export interface TailwindEffects<
    TailwindColor extends string,
    TailwindOpacity extends string,
    EffectsPlug extends {
        boxShadow?: string
        boxShadowColor?: string
    } = {
        boxShadow: ""
        boxShadowColor: ""
    },
> extends TailwindOpacityType<TailwindOpacity>,
        TailwindBoxShadowColorType<
            TailwindColor,
            EffectsPlug["boxShadowColor"]
        >,
        TailwindBoxShadowType<EffectsPlug["boxShadow"]>,
        TailwindBackgroundBlendModeType,
        TailwindMixBlendModeType {}
