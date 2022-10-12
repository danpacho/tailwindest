import { flattenObject } from "./flatten.object"
import { getStyleClass } from "./get.styleclass"
import type { NestedObject } from "./nested.object.type"

/**
 * @param styleObject
 * @returns tailwind class
 */
const getTailwindClass = <T extends NestedObject>(styleObject: T): string =>
    getStyleClass(flattenObject(styleObject))

export { getTailwindClass }
