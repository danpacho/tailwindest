import { TailwindForcedColorAdjustType } from "./@forced.color.adjust"
import { TailwindScreenReadersType } from "./@screen.readers"

export interface TailwindAccessibility
    extends TailwindScreenReadersType,
        TailwindForcedColorAdjustType {}
