import { TailwindBorderCollapseType } from "./@border.collapse"
import { TailwindBorderSpacingType } from "./@border.spacing"
import { TailwindCaptionSideType } from "./@caption.side"
import { TailwindTableLayoutType } from "./@table.layout"

export interface TailwindTables<TailwindSpacing extends string>
    extends TailwindBorderCollapseType,
        TailwindBorderSpacingType<TailwindSpacing>,
        TailwindTableLayoutType,
        TailwindCaptionSideType {}
