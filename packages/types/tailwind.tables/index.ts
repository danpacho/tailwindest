import { TailwindBorderCollapseType } from "./@border.collapse"
import { TailwindBorderSpacingType } from "./@border.spacing"
import { TailwindTableLayoutType } from "./@table.layout"

export interface TailwindTables
    extends TailwindBorderCollapseType,
        TailwindBorderSpacingType,
        TailwindTableLayoutType {}
