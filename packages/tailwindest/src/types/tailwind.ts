import type { TailwindAccessibility } from "./tailwind.accessibility"
import type { TailwindBackgrounds } from "./tailwind.backgrounds"
import type { TailwindBorders } from "./tailwind.borders"
import type { TailwindOpacity } from "./tailwind.common/@accent"
import type { TailwindColor } from "./tailwind.common/@color"
import type { TailwindSpacingVariants } from "./tailwind.common/@spacing.variants"
import type { TailwindEffects } from "./tailwind.effects"
import type { TailwindFilters } from "./tailwind.filters"
import type {
    TailwindFlex,
    TailwindFlexGridCommon,
    TailwindGrid,
} from "./tailwind.flex.grid"
import type { TailwindFont } from "./tailwind.font"
import type { TailwindInteractivity } from "./tailwind.interactivity"
import type { TailwindLayout } from "./tailwind.layout"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./tailwind.plugin.option"
import type { TailwindSizing } from "./tailwind.sizing"
import type { TailwindSpacing } from "./tailwind.spacing"
import type { TailwindSvg } from "./tailwind.svg"
import type { TailwindTables } from "./tailwind.tables"
import type { TailwindTransforms } from "./tailwind.transforms"
import type { TailwindTransitionAnimation } from "./tailwind.transition.animation"

export interface Tailwind<
    GlobalPlugOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    StylePlugOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
> extends TailwindAccessibility,
        TailwindGrid<StylePlugOption>,
        TailwindFilters<StylePlugOption>,
        TailwindTransitionAnimation<StylePlugOption>,
        TailwindSvg<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        TailwindFont<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        TailwindBorders<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        TailwindBackgrounds<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        TailwindFlex<
            TailwindSpacingVariants<GlobalPlugOption["color"]>,
            StylePlugOption
        >,
        TailwindFlexGridCommon<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindSizing<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindSpacing<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindTables<TailwindSpacingVariants<GlobalPlugOption["sizing"]>>,
        TailwindTransforms<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindLayout<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindInteractivity<
            TailwindColor<GlobalPlugOption>,
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        TailwindEffects<
            TailwindColor<GlobalPlugOption>,
            TailwindOpacity<GlobalPlugOption["opacity"]>,
            StylePlugOption
        > {}
