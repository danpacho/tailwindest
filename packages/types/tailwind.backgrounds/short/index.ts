import { Pluggable } from "../../plugin"
import { TailwindBackgroundImageType } from "../@gradient"
import { TailwindGradientColorStopsType } from "../@gradient.color.stops"
import { ShortTailwindBackgroundAttachmentType } from "./@background.attachment.short"
import { ShortTailwindBackgroundClipType } from "./@background.clip.short"
import { ShortTailwindBackgroundColorType } from "./@background.color.short"
import { ShortTailwindBackgroundOriginType } from "./@background.origin.short"
import { ShortTailwindBackgroundPositionType } from "./@background.position.short"
import { ShortTailwindBackgroundRepeatType } from "./@background.repeat.short"
import { ShortTailwindBackgroundSizeType } from "./@background.size.short"

export interface ShortTailwindBackgrounds<
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
> extends ShortTailwindBackgroundClipType,
        ShortTailwindBackgroundRepeatType,
        ShortTailwindBackgroundOriginType,
        ShortTailwindBackgroundAttachmentType,
        ShortTailwindBackgroundSizeType<BackgroundsPlug["backgroundSize"]>,
        ShortTailwindBackgroundPositionType<
            BackgroundsPlug["backgroundPosition"]
        >,
        ShortTailwindBackgroundColorType<
            TailwindColor,
            BackgroundsPlug["backgroundColor"]
        >,
        TailwindBackgroundImageType<BackgroundsPlug["backgroundImage"]>,
        TailwindGradientColorStopsType<
            TailwindColor | Pluggable<BackgroundsPlug["gradientColorStops"]>
        > {}
