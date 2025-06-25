import type { ClassList } from "./to_class"

export function toDef<StyleType>(
    classList: ClassList<string>,
    styleList: Array<StyleType>,
    styleMerger: (...styles: Array<StyleType>) => string,
    join: (...classList: ClassList<string>) => string
): string {
    return join(...classList, styleMerger(...styleList))
}
