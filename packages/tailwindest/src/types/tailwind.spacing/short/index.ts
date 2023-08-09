import { Pluggable } from "../../plugin"
import { TailwindSpaceType } from "../@space.between"
import { ShortTailwindMarginType } from "./@margin.short"
import { ShortTailwindPaddingType } from "./@padding.short"

export interface ShortTailwindSpacing<
    TailwindSpacing extends string,
    SpacingPlug extends {
        padding?: string
        margin?: string
        space?: string
    } = {
        padding: ""
        margin: ""
        space: ""
    },
> extends ShortTailwindMarginType<
            TailwindSpacing | Pluggable<SpacingPlug["margin"]>
        >,
        ShortTailwindPaddingType<
            TailwindSpacing | Pluggable<SpacingPlug["padding"]>
        >,
        TailwindSpaceType<TailwindSpacing | Pluggable<SpacingPlug["space"]>> {}
