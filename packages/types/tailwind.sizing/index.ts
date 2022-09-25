import {
    TailwindHeightType,
    TailwindMaxHeightType,
    TailwindMinHeightType,
} from "./@height"
import {
    TailwindMaxWidthType,
    TailwindMinWidthType,
    TailwindWidthType,
} from "./@width"

export interface TailwindSizing
    extends TailwindHeightType,
        TailwindMaxHeightType,
        TailwindMinHeightType,
        TailwindMaxWidthType,
        TailwindMinWidthType,
        TailwindWidthType {}
