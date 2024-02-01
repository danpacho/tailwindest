import { TailwindSizingPlug } from ".."
import {
    ShortTailwindHeightType,
    ShortTailwindMaxHeightType,
    ShortTailwindMinHeightType,
} from "./@height.short"
import {
    ShortTailwindMaxWidthType,
    ShortTailwindMinWidthType,
    ShortTailwindWidthType,
} from "./@width.short"

export interface ShortTailwindSizing<
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
> extends ShortTailwindMinHeightType<SizingPlug["minHeight"]>,
        ShortTailwindHeightType<TailwindSpacing, SizingPlug["height"]>,
        ShortTailwindMaxHeightType<TailwindSpacing, SizingPlug["maxHeight"]>,
        ShortTailwindMinWidthType<SizingPlug["minWidth"]>,
        ShortTailwindMaxWidthType<SizingPlug["maxHeight"]>,
        ShortTailwindWidthType<TailwindSpacing, SizingPlug["width"]> {}
