import type { NestedObject } from "../utils"
import { flattenObject } from "./flatten.object"
import { getStyleClass } from "./get.styleclass"

/**
 * @param styleObject
 * @returns tailwind class
 */
const getTailwindClass = <TailwindStyleObject>(
    styleObject: TailwindStyleObject
): string => getStyleClass(flattenObject(styleObject as NestedObject))

export { getTailwindClass }
