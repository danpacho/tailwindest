import { PluginOption } from "../plugin"
import { TailwindBackdropOpacityType } from "./@backdrop.opacity"
import { TailwindBackdropBlurType, TailwindBlurType } from "./@blur"
import {
    TailwindBackdropBrightnessType,
    TailwindBrightnessType,
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

type FiltersPluginKey =
    | "dropShadow"
    | "blur"
    | "contrast"
    | "grayscale"
    | "hueRotate"
    | "invert"
    | "opacity"
    | "saturate"
    | "sepia"
    | "backdropBrightness"
    | "backdropBlur"
    | "backdropContrast"
    | "backdropGrayscale"
    | "backdropHueRotate"
    | "backdropInvert"
    | "backdropOpacity"
    | "backdropSaturate"
    | "backdropSepia"
    | "brightness"

export interface TailwindFilters<
    FiltersPlug extends PluginOption<FiltersPluginKey> = PluginOption<
        FiltersPluginKey,
        ""
    >
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
