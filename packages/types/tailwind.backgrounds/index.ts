import { TailwindBackgroundColorType } from "./@backgroud.color"
import { TailwindBackgroundAttachmentType } from "./@background.attachment"
import { TailwindBackgroundClipType } from "./@background.clip"
import { TailwindBackgroundImageType } from "./@background.image"
import { TailwindBackgroundOriginType } from "./@background.origin"
import { TailwindBackgroundPositionType } from "./@background.position"
import { TailwindBackgroundRepeatType } from "./@background.repeat"
import { TailwindBackgroundSizeType } from "./@background.size"
import { TailwindGradientColorStopsType } from "./@gradient.color.stops"

export interface TailwindBackgrounds<
    TailwindColor extends string,
    BackgroundsPlug extends {
        backgroundSize?: string
        backgroundColor?: string
        backgroundImage?: string
        backgroundPosition?: string
        gradientColorStops?: string
    } = {
        backgroundSize: ""
        backgroundColor: ""
        backgroundImage: ""
        backgroundPosition: ""
        gradientColorStops: ""
    }
> extends TailwindBackgroundClipType,
        TailwindBackgroundRepeatType,
        TailwindBackgroundOriginType,
        TailwindBackgroundAttachmentType,
        TailwindBackgroundSizeType<BackgroundsPlug["backgroundSize"]>,
        TailwindBackgroundImageType<BackgroundsPlug["backgroundImage"]>,
        TailwindBackgroundPositionType<BackgroundsPlug["backgroundPosition"]>,
        TailwindBackgroundColorType<
            TailwindColor,
            BackgroundsPlug["backgroundColor"]
        >,
        TailwindGradientColorStopsType<
            TailwindColor,
            BackgroundsPlug["gradientColorStops"]
        > {}
