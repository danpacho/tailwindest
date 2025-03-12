import type { ClassList } from "./to_class"

export function toDef<StyleType, Literal extends string = string>(
    classList: ClassList<Literal>,
    styleList: Array<StyleType>,
    styleMerger: (...styles: Array<StyleType>) => string,
    join: (...classList: ClassList<Literal>) => string
): string {
    const classLiteral = join(...classList)
    const styleLiteral = styleMerger(...styleList)
    return join([classLiteral, styleLiteral])
}
