import type { TailwindAccessibility } from "./tailwind.accessibility"
import type { ShortTailwindBackgrounds } from "./tailwind.backgrounds/short"
import type { ShortTailwindBorders } from "./tailwind.borders/short"
import type { TailwindOpacity } from "./tailwind.common/@accent"
import type { TailwindColor } from "./tailwind.common/@color"
import type { TailwindSpacingVariants } from "./tailwind.common/@spacing.variants"
import type { ShortTailwindEffects } from "./tailwind.effects/short"
import type { TailwindFilters } from "./tailwind.filters"
import type {
    TailwindFlex,
    TailwindFlexGridCommon,
    TailwindGrid,
} from "./tailwind.flex.grid"
import type { TailwindFont } from "./tailwind.font"
import type { ShortTailwindInteractivity } from "./tailwind.interactivity/short"
import type { TailwindLayout } from "./tailwind.layout"
import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "./tailwind.plugin.option"
import type { ShortTailwindSizing } from "./tailwind.sizing/short"
import type { ShortTailwindSpacing } from "./tailwind.spacing/short"
import type { ShortTailwindSvg } from "./tailwind.svg/short"
import type { TailwindTables } from "./tailwind.tables"
import type { TailwindTransforms } from "./tailwind.transforms"
import type { TailwindTransitionAnimation } from "./tailwind.transition.animation"

export interface ShortTailwind<
    GlobalPlugOption extends TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    StylePlugOption extends TailwindStylePlugOption = TailwindDefaultStylePlug
> extends TailwindAccessibility,
        TailwindGrid<StylePlugOption>,
        TailwindFilters<StylePlugOption>,
        TailwindTransitionAnimation<StylePlugOption>,
        TailwindFont<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        TailwindFlex<
            TailwindSpacingVariants<GlobalPlugOption["color"]>,
            StylePlugOption
        >,
        TailwindFlexGridCommon<
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
        ShortTailwindSvg<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        ShortTailwindBorders<TailwindColor<GlobalPlugOption>, StylePlugOption>,
        ShortTailwindBackgrounds<
            TailwindColor<GlobalPlugOption>,
            StylePlugOption
        >,
        ShortTailwindSizing<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        ShortTailwindSpacing<
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        ShortTailwindInteractivity<
            TailwindColor<GlobalPlugOption>,
            TailwindSpacingVariants<GlobalPlugOption["sizing"]>,
            StylePlugOption
        >,
        ShortTailwindEffects<
            TailwindColor<GlobalPlugOption>,
            TailwindOpacity<GlobalPlugOption["opacity"]>,
            StylePlugOption
        > {}
