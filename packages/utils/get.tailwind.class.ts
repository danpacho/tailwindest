import { flattenObject } from "./flatten.object"
import { getStyleClass } from "./get.styleclass"
import type { NestedObject } from "./nested.object.type"

/**
 * @param styleObject
 * @returns tailwind class
 */
const getTailwindClass = <T>(styleObject: T): string =>
    getStyleClass(flattenObject(styleObject as NestedObject))

export { getTailwindClass }
