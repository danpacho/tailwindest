import { createTools, type GetVariants } from "./tools"
import { CreateTailwindest } from "./create_tailwindest"

// Merger public interfaces
export type { Merger as TailwindestMerger } from "./tools/merger_interface"
export type { ClassList as TailwindestClassList } from "./tools/to_class"

// V2 + tailwindcss < 4.0
export type { Tailwindest } from "./legacy/tailwindest"
export type { ShortTailwindest } from "./legacy/tailwindest.short"

// V3 + tailwindcss >= 4.0
export { createTools, type GetVariants, type CreateTailwindest }
