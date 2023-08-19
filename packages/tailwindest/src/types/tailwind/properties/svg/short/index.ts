import { TailwindFillType } from "../@fill"
import { TailwindStrokeType } from "../@stroke"
import { ShortTailwindStrokeWidthType } from "./@stroke.width.short"

export interface ShortTailwindSvg<
    TailwindColor extends string,
    SvgPlug extends {
        fill?: string
        stroke?: string
        strokeWidth?: string
    } = {
        fill: ""
        stroke: ""
        strokeWidth: ""
    },
> extends ShortTailwindStrokeWidthType<SvgPlug["strokeWidth"]>,
        TailwindStrokeType<TailwindColor, SvgPlug["stroke"]>,
        TailwindFillType<TailwindColor, SvgPlug["fill"]> {}
