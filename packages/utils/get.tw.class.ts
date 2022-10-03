import { flattenObject } from "./flatten.object"
import { getStyleClass } from "./get.styleclass"
import type { NestedObject } from "./nested.object.type"

const getTwClass = <T extends NestedObject>(styleObject: T): string =>
    getStyleClass(flattenObject(styleObject))

export { getTwClass }
