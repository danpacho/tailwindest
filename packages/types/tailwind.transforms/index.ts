import { TailwindRotateType } from "./@rotate"
import { TailwindScaleType } from "./@scale"
import { TailwindSkewType } from "./@skew"
import { TailwindTransformOriginType } from "./@transform.origin"
import { TailwindTranslateType } from "./@translate"

export interface TailwindTransforms
    extends TailwindRotateType,
        TailwindScaleType,
        TailwindSkewType,
        TailwindTransformOriginType,
        TailwindTranslateType {}
