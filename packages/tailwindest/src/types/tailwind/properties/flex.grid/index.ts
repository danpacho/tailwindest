//COMMON
import { Pluggable } from "../../../plugin"
import {
    TailwindAlignContentType,
    TailwindAlignItemsType,
    TailwindAlignSelfType,
} from "./@common.align"
import { TailwindGapType } from "./@common.gap"
import { TailwindJustifyContentType } from "./@common.justify"
import { TailwindFlexGridOrderType } from "./@common.order"
//FLEX
import { TailwindFlexType } from "./@flex"
import { TailwindFlexBasisType } from "./@flex.basis"
import { TailwindFlexDirectionType } from "./@flex.direction"
import { TailwindFlexGrowType } from "./@flex.grow"
import { TailwindFlexShrinkType } from "./@flex.shrink"
import { TailwindFlexWrapType } from "./@flex.wrap"
//GRID
import {
    TailwindGridAutoColumnsType,
    TailwindGridAutoRowsType,
} from "./@grid.auto"
import { TailwindGridAutoFlowType } from "./@grid.auto.flow"
import {
    TailwindGridColumnEndType,
    TailwindGridColumnStartType,
    TailwindGridColumnType,
} from "./@grid.column.start.end"
import {
    TailwindGridJustifyItemsType,
    TailwindGridJustifySelfType,
} from "./@grid.justify"
import {
    TailwindGridPlaceContentType,
    TailwindGridPlaceItemsType,
    TailwindGridPlaceSelfType,
} from "./@grid.place"
import {
    TailwindGridRowEndType,
    TailwindGridRowStartType,
    TailwindGridRowType,
} from "./@grid.row.start.end"
import {
    TailwindGridTemplateColumnsType,
    TailwindGridTemplateRowsType,
} from "./@grid.template"

interface TailwindFlexGridCommonPlug {
    gap?: string
    order?: string
}
export interface TailwindFlexGridCommon<
    TailwindSpacing extends string,
    FlexGridCommonPlug extends TailwindFlexGridCommonPlug = {
        gap: ""
        order: ""
    },
> extends TailwindAlignSelfType,
        TailwindAlignItemsType,
        TailwindAlignContentType,
        TailwindJustifyContentType,
        TailwindFlexGridOrderType<FlexGridCommonPlug["order"]>,
        TailwindGapType<
            TailwindSpacing | Pluggable<FlexGridCommonPlug["gap"]>
        > {}

interface TailwindFlexPlug {
    flex?: string
    flexBasis?: string
    flexGrow?: string
    flexShrink?: string
}

export interface TailwindFlex<
    TailwindSpacing extends string,
    FlexPlug extends TailwindFlexPlug = {
        flex: ""
        flexBasis: ""
        flexGrow: ""
        flexShrink: ""
    },
> extends TailwindFlexWrapType,
        TailwindFlexDirectionType,
        TailwindFlexType<FlexPlug["flex"]>,
        TailwindFlexGrowType<FlexPlug["flexGrow"]>,
        TailwindFlexShrinkType<FlexPlug["flexShrink"]>,
        TailwindFlexBasisType<TailwindSpacing, FlexPlug["flexBasis"]> {}

interface TailwindGridPlug {
    gridAutoColumns?: string
    gridAutoRows?: string
    gridColumn?: string
    gridColumnStart?: string
    gridColumnEnd?: string
    gridRow?: string
    gridRowEnd?: string
    gridRowStart?: string
    gridTemplateColumns?: string
    gridTemplateRows?: string
}

export interface TailwindGrid<
    GridPlug extends TailwindGridPlug = {
        gridAutoColumns: ""
        gridAutoRows: ""
        gridColumn: ""
        gridColumnStart: ""
        gridColumnEnd: ""
        gridRow: ""
        gridRowEnd: ""
        gridRowStart: ""
        gridTemplateColumns: ""
        gridTemplateRows: ""
    },
> extends TailwindGridAutoFlowType,
        TailwindGridPlaceSelfType,
        TailwindGridPlaceItemsType,
        TailwindGridJustifySelfType,
        TailwindGridJustifyItemsType,
        TailwindGridPlaceContentType,
        TailwindGridRowType<GridPlug["gridRow"]>,
        TailwindGridRowEndType<GridPlug["gridRowEnd"]>,
        TailwindGridRowStartType<GridPlug["gridRowStart"]>,
        TailwindGridColumnType<GridPlug["gridColumn"]>,
        TailwindGridColumnEndType<GridPlug["gridColumnEnd"]>,
        TailwindGridColumnStartType<GridPlug["gridColumnStart"]>,
        TailwindGridAutoRowsType<GridPlug["gridAutoRows"]>,
        TailwindGridAutoColumnsType<GridPlug["gridAutoColumns"]>,
        TailwindGridTemplateRowsType<GridPlug["gridTemplateRows"]>,
        TailwindGridTemplateColumnsType<GridPlug["gridTemplateColumns"]> {}

export interface TailwindFlexGridPlug
    extends TailwindFlexGridCommonPlug,
        TailwindFlexPlug,
        TailwindGridPlug {}
