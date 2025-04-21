import { createTools, type GetVariants } from "./tools"

// Merger public interfaces
export type { Merger as TailwindestMerger } from "./tools/merger_interface"
export type { ClassList as TailwindestClassList } from "./tools/to_class"

// V2 + tailwindcss < 4.0
export type { Tailwindest } from "./legacy/tailwindest"
export type { ShortTailwindest } from "./legacy/tailwindest.short"

// V3 + tailwindcss >= 4.0
export type {
    CreateTailwindest,
    CreateTailwindLiteral,
} from "./create_tailwindest"

// Export styler interfaces
export type {
    Styler,
    PrimitiveStyler,
    RotaryStyler,
    ToggleStyler,
    VariantsStyler,
} from "./tools"

export { createTools, type GetVariants }
