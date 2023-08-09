import { Pluggable } from "../../plugin"
import {
    TailwindBorderStyleType,
    TailwindDivideStyleType,
} from "../@border.style"
import { TailwindOutlineOffsetType } from "../@outline.offset"
import { TailwindOutlineStyleType } from "../@outline.style"
import {
    ShortTailwindBorderColorType,
    ShortTailwindDivideColorType,
} from "./@border.color.short"
import { ShortTailwindBorderRadiusType } from "./@border.radius.short"
import {
    ShortTailwindBorderWidthType,
    TailwindDivideWidthType,
} from "./@border.width.short"
import { ShortTailwindOutlineColorType } from "./@outline.color.short"
import { ShortTailwindOutlineWidthType } from "./@outline.width.short"
import { ShortTailwindRingColorType } from "./@ring.color.short"
import { ShortTailwindRingOffsetColorType } from "./@ring.offset.color.short"
import { ShortTailwindRingOffsetWidthType } from "./@ring.offset.width.short"
import { ShortTailwindRingWidthType } from "./@ring.width.short"

export interface ShortTailwindBorders<
    TailwindColor extends string,
    BordersPlug extends {
        borderColor?: string
        borderRadius?: string
        borderWidth?: string
        divideColor?: string
        divideWidth?: string
        outlineColor?: string
        outlineOffset?: string
        outlineWidth?: string
        ringOffsetColor?: string
        ringOffsetWidth?: string
        ringColor?: string
        ringWidth?: string
    } = {
        borderColor: ""
        borderRadius: ""
        borderWidth: ""
        divideColor: ""
        divideWidth: ""
        outlineColor: ""
        outlineOffset: ""
        outlineWidth: ""
        ringOffsetColor: ""
        ringOffsetWidth: ""
        ringColor: ""
        ringWidth: ""
    },
> extends ShortTailwindBorderWidthType<Pluggable<BordersPlug["borderWidth"]>>,
        ShortTailwindBorderRadiusType<BordersPlug["borderRadius"]>,
        ShortTailwindBorderColorType<
            TailwindColor | Pluggable<BordersPlug["borderColor"]>
        >,
        ShortTailwindRingWidthType<BordersPlug["ringWidth"]>,
        ShortTailwindRingColorType<TailwindColor, BordersPlug["ringColor"]>,
        ShortTailwindRingOffsetColorType<
            TailwindColor,
            BordersPlug["ringOffsetColor"]
        >,
        ShortTailwindRingOffsetWidthType<BordersPlug["ringOffsetWidth"]>,
        ShortTailwindOutlineWidthType<BordersPlug["outlineWidth"]>,
        ShortTailwindDivideColorType<
            TailwindColor | Pluggable<BordersPlug["divideColor"]>
        >,
        ShortTailwindOutlineColorType<
            TailwindColor,
            BordersPlug["outlineColor"]
        >,
        TailwindOutlineOffsetType<BordersPlug["outlineOffset"]>,
        TailwindDivideWidthType<Pluggable<BordersPlug["divideWidth"]>>,
        TailwindOutlineStyleType,
        TailwindDivideStyleType,
        TailwindBorderStyleType {}
