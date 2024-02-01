import { TailwindBackdropOpacityType } from "./@backdrop.opacity"
import { TailwindBackdropBlurType, TailwindBlurType } from "./@blur"
import {
    TailwindBackdropBrightnessType,
    TailwindBrightnessType,
} from "./@brightness"
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

export interface TailwindFiltersPlug {
    dropShadow?: string
    blur?: string
    contrast?: string
    grayscale?: string
    hueRotate?: string
    invert?: string
    saturate?: string
    sepia?: string
    backdropBrightness?: string
    backdropBlur?: string
    backdropContrast?: string
    backdropGrayscale?: string
    backdropHueRotate?: string
    backdropInvert?: string
    backdropOpacity?: string
    backdropSaturate?: string
    backdropSepia?: string
    brightness?: string
}

export interface TailwindFilters<
    FiltersPlug extends TailwindFiltersPlug = {
        dropShadow: ""
        blur: ""
        contrast: ""
        grayscale: ""
        hueRotate: ""
        invert: ""
        saturate: ""
        sepia: ""
        backdropBrightness: ""
        backdropBlur: ""
        backdropContrast: ""
        backdropGrayscale: ""
        backdropHueRotate: ""
        backdropInvert: ""
        backdropOpacity: ""
        backdropSaturate: ""
        backdropSepia: ""
        brightness: ""
    },
> extends TailwindBlurType<FiltersPlug["blur"]>,
        TailwindBrightnessType<FiltersPlug["brightness"]>,
        TailwindContrastType<FiltersPlug["contrast"]>,
        TailwindDropShadowType<FiltersPlug["dropShadow"]>,
        TailwindGrayscaleType<FiltersPlug["grayscale"]>,
        TailwindHueRotateType<FiltersPlug["hueRotate"]>,
        TailwindInvertType<FiltersPlug["invert"]>,
        TailwindSaturateType<FiltersPlug["saturate"]>,
        TailwindSepiaType<FiltersPlug["sepia"]>,
        TailwindBackdropOpacityType<FiltersPlug["backdropOpacity"]>,
        TailwindBackdropBlurType<FiltersPlug["backdropBlur"]>,
        TailwindBackdropBrightnessType<FiltersPlug["backdropBrightness"]>,
        TailwindBackdropGrayscaleType<FiltersPlug["backdropGrayscale"]>,
        TailwindBackdropSepiaType<FiltersPlug["backdropSepia"]>,
        TailwindBackdropHueRotateType<FiltersPlug["backdropHueRotate"]>,
        TailwindBackdropInvertType<FiltersPlug["backdropInvert"]>,
        TailwindBackdropSaturateType<FiltersPlug["backdropSaturate"]> {}
