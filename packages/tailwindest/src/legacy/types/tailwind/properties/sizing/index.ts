import {
    TailwindHeightType,
    TailwindMaxHeightType,
    TailwindMinHeightType,
} from "./@height"
import { TailwindSizeType } from "./@size"
import {
    TailwindMaxWidthType,
    TailwindMinWidthType,
    TailwindWidthType,
} from "./@width"

export interface TailwindSizingPlug {
    size?: string
    width?: string
    maxWidth?: string
    minWidth?: string
    height?: string
    maxHeight?: string
    minHeight?: string
}

export interface TailwindSizing<
    TailwindSpacing extends string,
    SizingPlug extends TailwindSizingPlug = {
        size: ""
        width: ""
        maxWidth: ""
        minWidth: ""
        height: ""
        maxHeight: ""
        minHeight: ""
    },
> extends TailwindSizeType<TailwindSpacing, SizingPlug["size"]>,
        // height
        TailwindHeightType<TailwindSpacing, SizingPlug["height"]>,
        TailwindMinHeightType<TailwindSpacing, SizingPlug["minHeight"]>,
        TailwindMaxHeightType<TailwindSpacing, SizingPlug["maxHeight"]>,
        // width
        TailwindWidthType<TailwindSpacing, SizingPlug["width"]>,
        TailwindMinWidthType<TailwindSpacing, SizingPlug["minWidth"]>,
        TailwindMaxWidthType<TailwindSpacing, SizingPlug["maxWidth"]> {}
