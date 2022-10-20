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

export interface TailwindSizing<
    TailwindSpacing extends string,
    SizingPlug extends {
        width?: string
        maxWidth?: string
        minWidth?: string
        height?: string
        maxHeight?: string
        minHeight?: string
    } = {
        width: ""
        maxWidth: ""
        minWidth: ""
        height: ""
        maxHeight: ""
        minHeight: ""
    }
> extends TailwindMinHeightType<SizingPlug["minHeight"]>,
        TailwindHeightType<TailwindSpacing, SizingPlug["height"]>,
        TailwindMaxHeightType<TailwindSpacing, SizingPlug["maxHeight"]>,
        TailwindMinWidthType<SizingPlug["minWidth"]>,
        TailwindMaxWidthType<SizingPlug["maxHeight"]>,
        TailwindWidthType<TailwindSpacing, SizingPlug["width"]> {}
