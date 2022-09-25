//COMMON
import {
    TailwindAlignContentType,
    TailwindAlignItemsType,
    TailwindAlignSelfType,
} from "./@common.align"
import {
    TailwindGapType,
    TailwindGapXType,
    TailwindGapYType,
} from "./@common.gap"
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
import { TailwindGridColumnType } from "./@grid.column.start.end"
import {
    TailwindGridJustifyItemsType,
    TailwindGridJustifySelfType,
} from "./@grid.justify"
import {
    TailwindGridPlaceContentType,
    TailwindGridPlaceItemsType,
    TailwindGridPlaceSelfType,
} from "./@grid.place"
import { TailwindGridRowStartEndType } from "./@grid.row.start.end"
import {
    TailwindGridTemplateColumnsType,
    TailwindGridTemplateRowsType,
} from "./@grid.template"

export interface TailwindFlexGridCommon
    extends TailwindAlignContentType,
        TailwindAlignItemsType,
        TailwindAlignSelfType,
        TailwindGapType,
        TailwindGapXType,
        TailwindGapYType,
        TailwindJustifyContentType,
        TailwindFlexGridOrderType {}

export interface TailwindFlex
    extends TailwindFlexType,
        TailwindFlexBasisType,
        TailwindFlexDirectionType,
        TailwindFlexGrowType,
        TailwindFlexShrinkType,
        TailwindFlexWrapType {}

export interface TailwindGrid
    extends TailwindGridAutoColumnsType,
        TailwindGridAutoRowsType,
        TailwindGridAutoFlowType,
        TailwindGridColumnType,
        TailwindGridJustifyItemsType,
        TailwindGridJustifySelfType,
        TailwindGridPlaceContentType,
        TailwindGridPlaceItemsType,
        TailwindGridPlaceSelfType,
        TailwindGridRowStartEndType,
        TailwindGridTemplateColumnsType,
        TailwindGridTemplateRowsType {}
