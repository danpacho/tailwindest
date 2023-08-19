import { deepMerge } from "../deep.merge"
import { getTailwindClass } from "../get.tailwind.class"

const createMergeProps =
    <StyleType>() =>
    (baseStyle: StyleType, styleProps: StyleType) =>
        getTailwindClass(deepMerge(baseStyle, styleProps))

export { createMergeProps }
