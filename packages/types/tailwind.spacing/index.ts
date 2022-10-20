import { TailwindMarginType } from "./@margin"
import { TailwindPaddingType } from "./@padding"
import { TailwindSpaceType } from "./@space.between"

export interface TailwindSpacing<
    TailwindSpacing extends string,
    SpacingPlug extends {
        padding?: string
        margin?: string
        space?: string
    } = {
        padding: ""
        margin: ""
        space: ""
    }
> extends TailwindMarginType<TailwindSpacing, SpacingPlug["margin"]>,
        TailwindPaddingType<TailwindSpacing, SpacingPlug["padding"]>,
        TailwindSpaceType<TailwindSpacing, SpacingPlug["space"]> {}
