import { TailwindBackgroundColorType } from "./@backgroud.color"
import { TailwindBackgroundAttachmentType } from "./@background.attachment"
import { TailwindBackgroundClipType } from "./@background.clip"
import { TailwindBackgroundOriginType } from "./@background.origin"
import { TailwindBackgroundPositionType } from "./@background.position"
import { TailwindBackgroundRepeatType } from "./@background.repeat"
import { TailwindBackgroundSizeType } from "./@background.size"
import { TailwindGradientColorStopsType } from "./@gradient.color.stops"

export interface TailwindBackgrounds
    extends TailwindBackgroundColorType,
        TailwindBackgroundAttachmentType,
        TailwindBackgroundClipType,
        TailwindBackgroundOriginType,
        TailwindBackgroundPositionType,
        TailwindBackgroundRepeatType,
        TailwindBackgroundSizeType,
        TailwindGradientColorStopsType {}
