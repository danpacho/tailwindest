import type { NestedObject } from "../../utils"
import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"

const createMergeProps =
    <StyleType extends NestedObject>() =>
    (baseStyle: StyleType, styleProps: StyleType) =>
        getTailwindClass(deepMerge(baseStyle, styleProps))

export { createMergeProps }
