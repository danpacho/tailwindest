import { deepMerge, getTailwindClass } from "../core"

/**
 * @note Usefull for merging style props
 * @param baseStyle base `wind.style()`
 * @returns merged style class `string`
 * @example
 * ```jsx
 * // ✅ Text wind style
 * const text = wind({
 *      ...textStyle
 * }).style()
 *
 * // ✅ Add specific style props
 * const Text = ({
 *     color,
 *     children,
 * }) => (
 *      <p className={mergeProps(text, { color })}>
 *          {children}
 *      </p>
 * )
 * ```
 */
const mergeProps = <T>(baseStyle: T, styleProps: T) =>
    getTailwindClass(deepMerge(baseStyle, styleProps))

export { mergeProps }
