import type { ClassList } from "./to_class"

/**
 * Merge class list into one valid style classname string
 */
export type Merger = (...classList: ClassList) => string
