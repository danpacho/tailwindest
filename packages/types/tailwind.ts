import { TailwindAccessbility } from "./tailwind.accessibility"
import { TailwindBackgrounds } from "./tailwind.backgrounds"
import { TailwindBorders } from "./tailwind.borders"
import { TailwindEffects } from "./tailwind.effects"
import { TailwindFilters } from "./tailwind.filters"
import {
    TailwindFlex,
    TailwindFlexGridCommon,
    TailwindGrid,
} from "./tailwind.flex.grid"
import { TailwindFont } from "./tailwind.font"
import { TailwindInteractivity } from "./tailwind.interactivity"
import { TailwindLayout } from "./tailwind.layout"
import { TailwindSizing } from "./tailwind.sizing"
import { TailwindSpacing } from "./tailwind.spacing"
import { TailwindSvg } from "./tailwind.svg"
import { TailwindTables } from "./tailwind.tables"
import { TailwindTransforms } from "./tailwind.transforms"
import { TailwindTransitionAnimation } from "./tailwind.transition.animation"

export interface Tailwind
    extends TailwindFlex,
        TailwindFlexGridCommon,
        TailwindGrid,
        TailwindLayout,
        TailwindSizing,
        TailwindSpacing,
        TailwindFont,
        TailwindBackgrounds,
        TailwindBorders,
        TailwindEffects,
        TailwindFilters,
        TailwindTables,
        TailwindTransitionAnimation,
        TailwindTransforms,
        TailwindInteractivity,
        TailwindSvg,
        TailwindAccessbility {}
