import { Pluggable } from "../../../plugin"
import { TailwindMarginType } from "./@margin"
import { TailwindPaddingType } from "./@padding"
import { TailwindSpaceType } from "./@space.between"

export interface TailwindSpacingPlug {
    padding?: string
    margin?: string
    space?: string
}
export interface TailwindSpacing<
    TailwindSpacing extends string,
    SpacingPlug extends TailwindSpacingPlug = {
        padding: ""
        margin: ""
        space: ""
    },
> extends TailwindMarginType<
            TailwindSpacing | Pluggable<SpacingPlug["margin"]>
        >,
        TailwindPaddingType<
            TailwindSpacing | Pluggable<SpacingPlug["padding"]>
        >,
        TailwindSpaceType<TailwindSpacing | Pluggable<SpacingPlug["space"]>> {}
