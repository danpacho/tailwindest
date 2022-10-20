import { TailwindHardwareAccelerationType } from "./@hardware.acceleration"
import { TailwindRotateType } from "./@rotate"
import { TailwindScaleType } from "./@scale"
import { TailwindSkewType } from "./@skew"
import { TailwindTransformOriginType } from "./@transform.origin"
import { TailwindTranslateType } from "./@translate"
export interface TailwindTransforms<
    TailwindSpacing extends string,
    TransformsPlug extends {
        skew?: string
        scale?: string
        rotate?: string
        translate?: string
        transformOrigin?: string
    } = {
        skew: ""
        scale: ""
        rotate: ""
        translate: ""
        transformOrigin: ""
    }
> extends TailwindHardwareAccelerationType,
        TailwindSkewType<TransformsPlug["skew"]>,
        TailwindScaleType<TransformsPlug["scale"]>,
        TailwindRotateType<TransformsPlug["rotate"]>,
        TailwindTransformOriginType<TransformsPlug["transformOrigin"]>,
        TailwindTranslateType<TailwindSpacing, TransformsPlug["translate"]> {}
