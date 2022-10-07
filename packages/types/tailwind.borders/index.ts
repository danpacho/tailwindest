import { TailwindBorderType } from "./@border"
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
import { TailwindOutlineWidthType } from "./@outline"
import { TailwindOutlineColorType } from "./@outline.color"
import { TailwindOutlineOffsetType } from "./@outline.offset"
import { TailwindOutlineStyleType } from "./@outline.style"
import { TailwindRingColorType } from "./@ring.color"
import { TailwindRingWidthOffsetType } from "./@ring.offset"
import { TailwindRingOffsetColorType } from "./@ring.offset.color"
import { TailwindRingWidthType } from "./@ring.width"

export interface TailwindBorders
    extends TailwindBorderType,
        TailwindBorderColorType,
        TailwindBorderRadiusType,
        TailwindBorderStyleType,
        TailwindBorderWidthType,
        TailwindDivideColorType,
        TailwindDivideStyleType,
        TailwindDivideWidthType,
        TailwindOutlineWidthType,
        TailwindOutlineColorType,
        TailwindOutlineOffsetType,
        TailwindOutlineStyleType,
        TailwindRingColorType,
        TailwindRingWidthOffsetType,
        TailwindRingOffsetColorType,
        TailwindRingWidthType {}
