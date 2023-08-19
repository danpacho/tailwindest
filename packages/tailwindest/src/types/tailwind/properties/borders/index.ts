import { Pluggable } from "../../../plugin"
import {
    TailwindBorderColorType,
    TailwindDivideColorType,
} from "./@border.color"
import { TailwindBorderRadiusType } from "./@border.radius"
import {
    TailwindBorderStyleType,
    TailwindDivideStyleType,
} from "./@border.style"
import {
    TailwindBorderWidthType,
    TailwindDivideWidthType,
} from "./@border.width"
import { TailwindOutlineColorType } from "./@outline.color"
import { TailwindOutlineOffsetType } from "./@outline.offset"
import { TailwindOutlineStyleType } from "./@outline.style"
import { TailwindOutlineWidthType } from "./@outline.width"
import { TailwindRingColorType } from "./@ring.color"
import { TailwindRingOffsetColorType } from "./@ring.offset.color"
import { TailwindRingOffsetWidthType } from "./@ring.offset.width"
import { TailwindRingWidthType } from "./@ring.width"

export interface TailwindBorders<
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
> extends TailwindOutlineStyleType,
        TailwindDivideStyleType,
        TailwindBorderStyleType,
        TailwindBorderWidthType<Pluggable<BordersPlug["borderWidth"]>>,
        TailwindBorderRadiusType<BordersPlug["borderRadius"]>,
        TailwindBorderColorType<
            TailwindColor | Pluggable<BordersPlug["borderColor"]>
        >,
        TailwindRingWidthType<BordersPlug["ringWidth"]>,
        TailwindRingColorType<TailwindColor, BordersPlug["ringColor"]>,
        TailwindRingOffsetColorType<
            TailwindColor,
            BordersPlug["ringOffsetColor"]
        >,
        TailwindRingOffsetWidthType<BordersPlug["ringOffsetWidth"]>,
        TailwindOutlineOffsetType<BordersPlug["outlineOffset"]>,
        TailwindOutlineWidthType<BordersPlug["outlineWidth"]>,
        TailwindOutlineColorType<TailwindColor, BordersPlug["outlineColor"]>,
        TailwindDivideWidthType<Pluggable<BordersPlug["divideWidth"]>>,
        TailwindDivideColorType<
            TailwindColor | Pluggable<BordersPlug["divideColor"]>
        > {}
