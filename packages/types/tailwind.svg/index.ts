import { TailwindFillType } from "./@fill"
import { TailwindStrokeType } from "./@stroke"
import { TailwindStrokeWidthType } from "./@stroke.width"

export interface TailwindSvg<
    TailwindColor extends string,
    SvgPlug extends {
        fill?: string
        stroke?: string
        strokeWidth?: string
    } = {
        fill: ""
        stroke: ""
        strokeWidth: ""
    }
> extends TailwindStrokeWidthType<SvgPlug["strokeWidth"]>,
        TailwindStrokeType<TailwindColor, SvgPlug["stroke"]>,
        TailwindFillType<TailwindColor, SvgPlug["fill"]> {}
