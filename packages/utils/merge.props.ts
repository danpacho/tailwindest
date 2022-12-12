import { deepMerge, getTailwindClass } from "../core"
import type { NestedObject } from "../core/nested.object.type"

/**
 * @description Useful for merging style props
 * @param baseStyle base `wind.style()`
 * @returns merged style class `string`
 * @example
 * ```tsx
 * // ✅ Text wind style
 * const text = wind({
 *      ...textStyle
 * }).style()
 *
 * // ✅ Add specific style props
const Text = (
    props: React.PropsWithChildren<
        Pick<
            Tailwindest,
            | "color"
            | "fontWeight"
        >
    >
) => {
    const { children, ...option } = props
    return (
        <p className={mergeProps(text, option)}>
            {children}
        </p>
)}
 * ```
 */
const mergeProps = <T extends NestedObject>(baseStyle: T, styleProps: T) =>
    getTailwindClass(deepMerge(baseStyle, styleProps))

export { mergeProps }
