import { deepMerge, getTailwindClass } from "../core"

const createMergeProps =
    <StyleType>() =>
    (baseStyle: StyleType, styleProps: StyleType) =>
        getTailwindClass(deepMerge(baseStyle, styleProps))

export { createMergeProps }
