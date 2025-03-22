import type { ClassList } from "./to_class"

export function toDef<StyleType>(
    classList: ClassList<string>,
    styleList: Array<StyleType>,
    styleMerger: (...styles: Array<StyleType>) => string,
    join: (...classList: ClassList<string>) => string
): string {
    const classLiteral = join(...classList)
    const styleLiteral = styleMerger(...styleList)
    return join(classLiteral, styleLiteral)
}
