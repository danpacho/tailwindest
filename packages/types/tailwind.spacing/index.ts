import { TailwindMarginType } from "./@margin"
import { TailwindPaddingType } from "./@padding"
import { TailwindSpaceBetweenType } from "./@space.between"

export interface TailwindSpacing
    extends TailwindMarginType,
        TailwindPaddingType,
        TailwindSpaceBetweenType {}
