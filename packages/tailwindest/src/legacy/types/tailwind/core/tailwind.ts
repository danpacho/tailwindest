import type {
    TailwindDefaultGlobalPlugOption,
    TailwindDefaultStylePlug,
    TailwindGlobalPlugOption,
    TailwindStylePlugOption,
} from "../plugin"
import type {
    TailwindAccessibility,
    TailwindBackgrounds,
    TailwindBorders,
    TailwindColor,
    TailwindEffects,
    TailwindFilters,
    TailwindFlex,
    TailwindFlexGridCommon,
    TailwindFont,
    TailwindGrid,
    TailwindInteractivity,
    TailwindLayout,
    TailwindOpacity,
    TailwindSizing,
    TailwindSpacing,
    TailwindSpacingVariants,
    TailwindSvg,
    TailwindTables,
    TailwindTransforms,
    TailwindTransitionAnimation,
} from "../properties"

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
