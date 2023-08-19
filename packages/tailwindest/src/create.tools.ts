import {
    createMergeProps,
    createRotary,
    createStyle,
    createToggle,
    createVariants,
} from "./core"

/**
 * @description Create tools with `Tailwindest` type
 * @example
 * ```ts
 * type CustomTailwindest = Tailwindest<{
 *      // Add custom colors
 *      color: "my-color1" | "my-color2",
 * }, {}>
 *
 * // Plug type at generic to get style tools
 * const tw = createTools<CustomTailwindest>()
 *
 * // Name the tools, and export it
 * export { tw }
 * ```
 */
const createTools = <StyleType>() => {
    const styleWithType = createStyle<StyleType>()
    const toggleWithType = createToggle<StyleType>()
    const rotaryWithType = createRotary<StyleType>()
    const variantsWithType = createVariants<StyleType>()
    const mergePropsWithType = createMergeProps<StyleType>()

    return {
        /**
         * @description Create `tailwind` style
         * @example
         * ```tsx
         * // Define tailwind style
         * const box = tw.style({
         *      display: "flex",
         *      alignItems: "items-center",
         *      justifyContent: "justify-center",
         * })
         *
         * // Use it in component
         * const Box = ({ children }) => {
         *      return <div className={box.class}>{children}</div>
         * }
         * ```
         */
        style: styleWithType,

        /**
         * @description Create `toggle` style function
         * @example
         * ```tsx
         * // Define toggle style
         * const themeBtn = tw.toggle({
         *      truthy: {}, // 🌝 light mode
         *      falsy: {}, // 🌚 dark mode
         *      base: {}, // [optional] base style
         * })
         *
         * // Use it in component
         * const ThemeBtn = ({
         *      children,
         * }) => {
         *      const [isLight, setIsLight] = useState(false)
         *      return (
         *          <button
         *              className={themeBtn.class(isLight)}
         *          >
         *              {children}
         *          </button>
         *      )
         * }
         * ```
         */
        toggle: toggleWithType,

        /**
         * @description Create `rotary` style function
         * @example
         * ```tsx
         * // Define rotary style
         * const btnType = tw.rotary({
         *      default: {},
         *      success: {},
         *      warning: {},
         *      base: {}, // [optional] base style
         * })
         *
         * // Get rotary type with GetVariants
         * interface BtnProps {
         *      onClick: () => void
         *      children: ReactNode
         *      type?: GetVariants<typeof btnType>
         * }
         *
         * // Use it in component
         * const Btn = ({
         *      onClick,
         *      children,
         *      type = "default",
         * }: BtnProps) => (
         *      <button
         *          className={btn.class(type)}
         *          onClick={onClick}
         *      >
         *          {children}
         *      </button>
         * )
         * ```
         */
        rotary: rotaryWithType,

        /**
         * @description Create `variants` style function. `variants` are combination of rotary switch.
         * @example
         * ```tsx
         * // Define variants style
         * const btn = tw.variants({
         *      variants: {
         *          type: {
         *              default: {},
         *              success: {},
         *              warning: {},
         *          },
         *          size: {
         *              sm: {},
         *              md: {},
         *              lg: {},
         *          },
         *          light: {
         *              true: {}, // truthy boolean
         *              false: {}, // falsy boolean
         *          }
         *      },
         *      base: {}, // [optional] base style
         * })
         *
         * // Get variants type with GetVariants
         * interface BtnProps extends GetVariants<typeof btn> {
         *      onClick: () => void
         *      children: ReactNode
         * }
         *
         * // Use it in component
         * const Btn = ({
         *      children,
         *      size = "md",
         *      type = "default",
         *      light = false,
         *      onClick,
         * }: BtnProps) => (
         *      <button
         *          className={btn.class({ size, type, light })}
         *          onClick={onClick}
         *      >
         *          {children}
         *      </button>
         * )
         * ```
         */
        variants: variantsWithType,

        /**
         * @description Override style property
         * @returns Merged className `string`
         * @example
         * ```tsx
         * // Add specific style props
         * const Text = ({
         *      children,
         *      ...option
         * }: PropsWithChildren<Pick<Tailwindest, "color" | "fontWeight">>) => {
         *    return (
         *        <p
         *            className={mergeProps(
         *                {
         *                    // base style
         *                    color: "text-gray-950",
         *                    fontWeight: "font-bold",
         *                    fontSize: "text-base",
         *                },
         *                // override color and fontWeight
         *                option
         *            )}
         *        >
         *            {children}
         *        </p>
         *    )
         * }
         * ```
         */
        mergeProps: mergePropsWithType,
    }
}

export { createTools }
