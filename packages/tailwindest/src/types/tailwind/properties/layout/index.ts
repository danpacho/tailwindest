import { Pluggable } from "../../../plugin"
import { TailwindAspectRatioType } from "./@aspect.ratio"
import { TailwindBoxDecorationBreakType } from "./@box.decoration.break"
import { TailwindBoxSizingType } from "./@box.sizing"
import { TailwindBreakType } from "./@break"
import { TailwindClearType } from "./@clear"
import { TailwindColumnsType } from "./@columns"
import { TailwindContainerType } from "./@container"
import { TailwindDisplayType } from "./@display"
import { TailwindFloatsType } from "./@floats"
import { TailwindIsolationType } from "./@isolation"
import { TailwindObjectFitType } from "./@object.fit"
import { TailwindObjectPositionType } from "./@object.position"
import { TailwindOverflowType } from "./@overflow"
import { TailwindOverscrollBehaviorType } from "./@overscroll.behavior"
import { TailwindPositionType, TailwindPositionValueType } from "./@position"
import { TailwindVisibilityType } from "./@visibility"
import { TailwindZIndexType } from "./@z.index"

export interface TailwindLayout<
    GlobalPlug extends string,
    LayoutPlug extends {
        inset?: string
        zIndex?: string
        columns?: string
        aspectRatio?: string
        objectPosition?: string
    } = {
        inset: ""
        zIndex: ""
        columns: ""
        aspectRatio: ""
        objectPosition: ""
    },
> extends TailwindBoxDecorationBreakType,
        TailwindBoxSizingType,
        TailwindBreakType,
        TailwindClearType,
        TailwindFloatsType,
        TailwindDisplayType,
        TailwindOverflowType,
        TailwindIsolationType,
        TailwindObjectFitType,
        TailwindContainerType,
        TailwindVisibilityType,
        TailwindOverscrollBehaviorType,
        TailwindZIndexType<LayoutPlug["zIndex"]>,
        TailwindColumnsType<LayoutPlug["columns"]>,
        TailwindAspectRatioType<LayoutPlug["aspectRatio"]>,
        TailwindObjectPositionType<LayoutPlug["objectPosition"]>,
        TailwindPositionType,
        TailwindPositionValueType<
            GlobalPlug | Pluggable<LayoutPlug["inset"]>
        > {}
