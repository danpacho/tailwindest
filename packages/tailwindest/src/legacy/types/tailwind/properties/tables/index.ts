import { Pluggable } from "../../../plugin"
import { TailwindBorderCollapseType } from "./@border.collapse"
import { TailwindBorderSpacingType } from "./@border.spacing"
import { TailwindCaptionSideType } from "./@caption.side"
import { TailwindTableLayoutType } from "./@table.layout"

export interface TailwindTablesPlug {
    borderSpacing?: string
}
export interface TailwindTables<
    TailwindSpacing extends string,
    TablesPlug extends TailwindTablesPlug = {
        borderSpacing: ""
    },
> extends TailwindBorderCollapseType,
        TailwindBorderSpacingType<
            TailwindSpacing | Pluggable<TablesPlug["borderSpacing"]>
        >,
        TailwindTableLayoutType,
        TailwindCaptionSideType {}
