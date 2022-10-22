import { TailwindBorderCollapseType } from "./@border.collapse"
import { TailwindBorderSpacingType } from "./@border.spacing"
import { TailwindTableLayoutType } from "./@table.layout"

export interface TailwindTables<TailwindSpacing extends string>
    extends TailwindBorderCollapseType,
        TailwindBorderSpacingType<TailwindSpacing>,
        TailwindTableLayoutType {}
