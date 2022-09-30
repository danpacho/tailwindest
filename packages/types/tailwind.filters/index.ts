import { TailwindBackdropOpacityType } from "./@backdrop.opacity"
import { TailwindBackdropBlurType, TailwindBlurType } from "./@blur"
import {
    TailwindBackdropBrigthnessType,
    TailwindBrigtnessType,
} from "./@brigtness"
import { TailwindContrastType } from "./@contrast"
import { TailwindDropShadowType } from "./@drop.shadow"
import {
    TailwindBackdropGrayscaleType,
    TailwindGrayscaleType,
} from "./@grayscale"
import {
    TailwindBackdropHueRotateType,
    TailwindHueRotateType,
} from "./@hue.rotate"
import { TailwindBackdropInvertType, TailwindInvertType } from "./@invert"
import { TailwindBackdropSaturateType, TailwindSaturateType } from "./@saturate"
import { TailwindBackdropSepiaType, TailwindSepiaType } from "./@sepia"

export interface TailwindFilters
    extends TailwindBackdropOpacityType,
        TailwindBackdropBlurType,
        TailwindBlurType,
        TailwindBackdropBrigthnessType,
        TailwindBrigtnessType,
        TailwindContrastType,
        TailwindDropShadowType,
        TailwindBackdropGrayscaleType,
        TailwindGrayscaleType,
        TailwindBackdropHueRotateType,
        TailwindHueRotateType,
        TailwindBackdropInvertType,
        TailwindInvertType,
        TailwindBackdropSaturateType,
        TailwindSaturateType,
        TailwindBackdropSepiaType,
        TailwindSepiaType {}
