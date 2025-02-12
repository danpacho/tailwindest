import {
    createMergeProps,
    createRotary,
    createStyle,
    createToggle,
    createVariants,
} from "./tools"
import { type GetVariantsKey } from "./utils"
const createTools = <StyleType>(): {
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
    style: (style: StyleType) => {
        class: string
        style: StyleType
        compose: (...styles: Array<StyleType>) => {
            class: string
            style: StyleType
        }
    }

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
    toggle: (toggleVariants: {
        truthy: StyleType
        falsy: StyleType
        base?: StyleType
    }) => {
        class: (styleArgs: boolean) => string
        style: (styleArgs: boolean) => StyleType
        compose: (...styles: Array<StyleType>) => {
            class: (styleArgs: boolean) => string
            style: (styleArgs: boolean) => StyleType
        }
    }

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
    rotary: <VariantsStylesType>({
        base,
        ...styles
    }: { [key in keyof VariantsStylesType]: StyleType } & {
        base?: StyleType
    }) => {
        class: (
            styleArgs: GetVariantsKey<Exclude<keyof VariantsStylesType, "base">>
        ) => string
        style: (
            styleArgs: GetVariantsKey<Exclude<keyof VariantsStylesType, "base">>
        ) => StyleType
        compose: (...styles: Array<StyleType>) => {
            class: (
                styleArgs: GetVariantsKey<
                    Exclude<keyof VariantsStylesType, "base">
                >
            ) => string
            style: (
                styleArgs: GetVariantsKey<
                    Exclude<keyof VariantsStylesType, "base">
                >
            ) => StyleType
        }
    }

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
    variants: <Variants>({
        base,
        variants,
    }: {
        variants: {
            [VariantsKey in keyof Variants]: Record<
                keyof Variants[VariantsKey],
                StyleType
            >
        }
    } & {
        base?: StyleType
    }) => {
        class: (styleArgs: {
            [VariantsKey in keyof Variants]: GetVariantsKey<
                keyof Variants[VariantsKey]
            >
        }) => string
        style: (styleArgs: {
            [VariantsKey in keyof Variants]: GetVariantsKey<
                keyof Variants[VariantsKey]
            >
        }) => StyleType
        compose: (...styles: Array<StyleType>) => {
            class: (styleArgs: {
                [VariantsKey in keyof Variants]: GetVariantsKey<
                    keyof Variants[VariantsKey]
                >
            }) => string
            style: (styleArgs: {
                [VariantsKey in keyof Variants]: GetVariantsKey<
                    keyof Variants[VariantsKey]
                >
            }) => StyleType
        }
    }

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
    mergeProps: (baseStyle: StyleType, styleProps: StyleType) => string
} => {
    const style = createStyle<StyleType>()
    const toggle = createToggle<StyleType>()
    const rotary = createRotary<StyleType>()
    const variants = createVariants<StyleType>()
    const mergeProps = createMergeProps<StyleType>()

    return {
        style,
        toggle,
        rotary,
        variants,
        mergeProps,
    }
}

export { createTools }
