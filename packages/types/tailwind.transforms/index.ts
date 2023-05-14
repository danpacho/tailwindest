import { ToPlugin } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"
import { TailwindHardwareAccelerationType } from "./@hardware.acceleration"
import { TailwindRotateType } from "./@rotate"
import { TailwindScaleType } from "./@scale"
import { TailwindSkewType } from "./@skew"
import { TailwindTransformOriginType } from "./@transform.origin"
import { TailwindTranslateType } from "./@translate"

type TailwindSkewVariants =
    | "0"
    | "1"
    | "2"
    | "3"
    | "6"
    | "12"
    | TailwindArbitrary

type TailwindScaleVariants =
    | "0"
    | "50"
    | "75"
    | "90"
    | "95"
    | "100"
    | "105"
    | "110"
    | "125"
    | "150"
    | TailwindArbitrary

type TailwindTranslateVariants =
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "full"
    | TailwindArbitrary

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
        TailwindRotateType<TransformsPlug["rotate"]>,
        TailwindSkewType<
            ToPlugin<TailwindSkewVariants, TransformsPlug["skew"]>
        >,
        TailwindScaleType<
            ToPlugin<TailwindScaleVariants, TransformsPlug["scale"]>
        >,
        TailwindTransformOriginType<TransformsPlug["transformOrigin"]>,
        TailwindTranslateType<
            ToPlugin<
                TailwindSpacing | TailwindTranslateVariants,
                TransformsPlug["translate"]
            >
        > {}
