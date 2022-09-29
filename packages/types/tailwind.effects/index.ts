import { TailwindBackgroundBlendModeType } from "./@background.blend.mode"
import { TailwindBoxShadowType } from "./@box.shadow"
import { TailwindBoxShadowColorType } from "./@box.shadow.color"
import { TailwindMixBlendModeType } from "./@mix.blend.mode"
import { TailwindOpacityType } from "./@opacity"

export interface TailwindEffects
    extends TailwindBackgroundBlendModeType,
        TailwindBoxShadowType,
        TailwindBoxShadowColorType,
        TailwindMixBlendModeType,
        TailwindOpacityType {}
