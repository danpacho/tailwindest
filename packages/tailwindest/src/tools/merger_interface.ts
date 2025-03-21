/**
 * @interface
 * Merge arbitrary class list into one valid style classname string
 */
export type Merger<ClassList extends Array<any> = any[]> = (
    ...classList: ClassList
) => string
