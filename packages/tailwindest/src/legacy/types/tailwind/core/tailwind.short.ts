import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "../plugin"
import type {
    ShortTailwindBackgrounds,
    ShortTailwindBorders,
    ShortTailwindEffects,
    ShortTailwindInteractivity,
    ShortTailwindSizing,
    ShortTailwindSpacing,
    ShortTailwindSvg,
    TailwindAccessibility,
    TailwindColor,
    TailwindFilters,
    TailwindFlex,
    TailwindFlexGridCommon,
    TailwindFont,
    TailwindGrid,
    TailwindLayout,
    TailwindOpacity,
    TailwindSpacingVariants,
    TailwindTables,
    TailwindTransforms,
    TailwindTransitionAnimation,
} from "../properties"

export interface ShortTailwind<
    GlobalPlugOption extends
        TailwindGlobalPlugOption = TailwindDefaultGlobalPlugOption,
    StylePlugOption extends TailwindStylePlugOption = TailwindDefaultStylePlug,
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
