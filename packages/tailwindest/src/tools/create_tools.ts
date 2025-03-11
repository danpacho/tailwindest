import { PrimitiveStyler } from "./primitive"
import { type ToggleVariants, ToggleStyler } from "./toggle"
import { RotaryStyler } from "./rotary"
import { type VariantsRecord, VariantsStyler } from "./variants"
import { Styler } from "./styler"
import type { Merger } from "./merger_interface"
import { toClass, type ClassList } from "./to_class"

type Stringify<T> = T extends string ? T : never

interface ToolOptions {
    /**
     * Merge tailwind className strings
     * @example
     * ```ts
     * // Using `tw-merge` as className merger
     * const twMerge = createTailwindMerge(() => {...})
     *
     * // merger added
     * const tw = createTools<Tailwindest>({ merger: twMerge })
     * ```
     */
    merger?: Merger
}

export const createTools = <StyleType>({ merger }: ToolOptions = {}) => {
    const join = (...classList: ClassList): string => {
        const res = toClass(classList)
        if (merger) {
            return merger(res)
        }
        return res
    }

    const style = (stylesheet: StyleType) => {
        const styler = new PrimitiveStyler<StyleType>(stylesheet)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const toggle = (toggleVariants: ToggleVariants<StyleType>) => {
        const styler = new ToggleStyler<StyleType>(toggleVariants)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const rotary = <VRecord extends Record<string, StyleType>>(params: {
        base?: StyleType
        variants: VRecord
    }) => {
        const styler = new RotaryStyler<StyleType, Stringify<keyof VRecord>>(
            params
        )
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const variants = <VMap extends VariantsRecord<StyleType>>(params: {
        base?: StyleType
        variants: VMap
    }) => {
        const styler = new VariantsStyler<StyleType, VMap>(params)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const mergeRecord = (
        baseRecord: StyleType,
        overrideRecord: StyleType
    ): StyleType => Styler.deepMerge(baseRecord, overrideRecord)

    const mergeProps = (baseStyle: StyleType, styleProps: StyleType) => {
        const res = Styler.getClassName(mergeRecord(baseStyle, styleProps))
        if (merger) {
            return merger(res)
        }
        return res
    }

    return {
        /**
         * Join all the possible combinations into string
         * @param classList all the possible sheet format
         * @see {@link https://github.com/lukeed/clsx#readme clsx}
         */
        join,
        /**
         * Create `rotary` styler
         * @example
         * ```tsx
         * const btn = tw.rotary({
         *      variants: {
         *          default: {},
         *          success: {},
         *          warning: {},
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * const warningBtn = btn.class("warning")
         * ```
         */
        style,
        /**
         * Create `toggle` styler
         * @example
         * ```tsx
         * const themeBtn = tw.toggle({
         *      base  : {},   // [optional] base style
         *      truthy: {},   // light mode
         *      falsy : {},   // dark mode
         * })
         *
         * const light = themeBtn.class(true)
         * ```
         */
        toggle,
        /**
         * Create `rotary` styler
         * @example
         * ```tsx
         * const box = tw.rotary({
         *      variants: {
         *          sm: {},
         *          md: {},
         *          lg: {},
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * const mdBox = themeBtn.class("md")
         * ```
         */
        rotary,
        /**
         * Create `variants` styler
         * @example
         * ```tsx
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
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * btn.class({ size: "md", type: "default" })
         * ```
         */
        variants,
        /**
         * Merge two style record into string
         * @returns Merged className `string`
         * @example
         * ```tsx
         * tw.mergeProps(
         *      {
         *          color: "text-gray-950",
         *          fontWeight: "font-bold",
         *          fontSize: "text-base",
         *      },
         *      {
         *          color: "text-red-100",
         *      }
         * }
         *
         * // text-red-100 font-bold text-base
         * ```
         */
        mergeProps,
        /**
         * Merge two record
         * @returns Merged record
         * @example
         * ```tsx
         * tw.mergeRecord(
         *      {
         *          color: "text-gray-950",
         *          fontWeight: "font-bold",
         *          fontSize: "text-base",
         *      },
         *      {
         *          color: "text-red-100",
         *      }
         * }
         *
         * //   {
         * //       color: "text-red-100",
         * //       fontWeight: "font-bold",
         * //       fontSize: "text-base",
         * //   }
         * ```
         */
        mergeRecord,
    }
}
