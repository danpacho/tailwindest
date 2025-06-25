import type { TailwindestInterface } from "../create_tailwindest"
import { Styler } from "./styler"
import { PrimitiveStyler } from "./primitive"
import { type ToggleVariants, ToggleStyler } from "./toggle"
import { RotaryStyler } from "./rotary"
import { type VariantsRecord, VariantsStyler } from "./variants"
import type { Merger } from "./merger_interface"
import { toClass, type ClassList } from "./to_class"
import { toDef } from "./to_def"

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

/**
 * Create core styler tools
 *
 * @description Run `npx create-tailwind-type` to generate tailwind type defs.
 * ```bash
 * npx create-tailwind-type --base node_modules/tailwindcss --no-arbitrary-value --disable-variants
 * ```
 * @see {@link https://github.com/danpacho/tailwindest#create-tailwind-type create-tailwind-type}
 *
 * @example
 * ```ts
 * // 1. import generated types via
 * import type { Tailwind, TailwindNestGroups } from "~/tailwind.ts"
 *
 * // 2. create type
 * export type Tailwindest = CreateTailwindest<{
 *      tailwind: Tailwind
 *      tailwindNestGroups: TailwindNestGroups
 *      useArbitrary: true
 *      groupPrefix: "#"
 * }>
 *
 * export type TailwindLiteral = CreateTailwindLiteral<Tailwind>
 *
 * // 3. create tools
 * export const tw = createTools<{
 *      tailwindest: Tailwindest
 *      tailwindLiteral: TailwindLiteral
 *      useArbitrary: true  // enable arbitrary strings
 *      useTypedClassLiteral: true // enable typed class literal
 * >({
 *      merger: twMerge // set tailwind-merge as merger, [optional]
 * })
 * ```
 */
export const createTools = <Type extends TailwindestInterface>({
    merger,
}: ToolOptions = {}) => {
    type StyleType = Type["tailwindest"]
    type ClassLiteral = Type["useArbitrary"] extends true
        ? Type["tailwindLiteral"] | (`${string}` & {})
        : Type["tailwindLiteral"]
    type StyleLiteral = Type["useTypedClassLiteral"] extends true
        ? ClassLiteral
        : string

    const style = (stylesheet: StyleType) =>
        new PrimitiveStyler<StyleType, StyleLiteral>(stylesheet).setMerger(
            merger
        )

    const toggle = (toggleVariants: ToggleVariants<StyleType>) =>
        new ToggleStyler<StyleType, StyleLiteral>(toggleVariants).setMerger(
            merger
        )

    const rotary = <VRecord extends Record<string, StyleType>>(params: {
        base?: StyleType
        variants: VRecord
    }) =>
        new RotaryStyler<StyleType, Stringify<keyof VRecord>, StyleLiteral>(
            params
        ).setMerger(merger)

    const variants = <VMap extends VariantsRecord<StyleType>>(params: {
        base?: StyleType
        variants: VMap
    }) =>
        new VariantsStyler<StyleType, VMap, StyleLiteral>(params).setMerger(
            merger
        )

    const mergeRecord = (...overrideRecord: Array<StyleType>): StyleType =>
        overrideRecord.reduce<StyleType>(
            (override, curr) => Styler.deepMerge(override, curr),
            {}
        )

    const mergeProps = (...overrideStyles: Array<StyleType>): string => {
        const res = Styler.getClassName(mergeRecord(...overrideStyles))
        if (merger) {
            return merger(res)
        }
        return res
    }

    const join = (...classList: ClassList<ClassLiteral>): string => {
        if (merger) {
            const classListStr = toClass(classList)
            const tokens = classListStr
                .split(" ")
                .filter((e) => e.length > 0)
                .map((e) => e.trim())
            return merger(...tokens)
        }
        return toClass(classList)
    }

    const def = (
        classList: ClassList<ClassLiteral>,
        ...styleList: Array<StyleType>
    ): string => toDef<StyleType>(classList, styleList, mergeProps, join)

    return {
        /**
         * Define style
         *
         * `styleList` has higher priority than `classList`
         *
         * @see {@link https://github.com/lukeed/clsx#readme clsx}
         * @param classList join target styles
         * @param styleList define styles in a record structure way
         *
         * @example
         * ```ts
         * const box = tw.def(
         *      ["bg-white", "dark:bg-black", ... ],
         *      {
         *          padding: ["px-2", "py-1"],
         *          hover: {
         *              backgroundColor: "hover:bg-neutral-200"
         *          }
         *      }
         * )
         * // bg-white dark:bg-black px-2 py-1 hover:bg-neutral-200
         * ```
         */
        def,
        /**
         * Join all the possible combinations into string
         * @param classList all the possible sheet format
         * @see {@link https://github.com/lukeed/clsx#readme clsx}
         * @example
         * ```ts
         * const box = tw.join(...values)
         * ```
         */
        join,
        /**
         * Create primitive style
         * @example
         * ```tsx
         * const box = tw.style({
         *      display: "flex",
         *      alignItems: "items-center",
         *      padding: ["px-2", "py-[2.25px]"],
         *      hover: {
         *          opacity: "hover:opacity-90"
         *      },
         *      sm: {
         *          padding: ["px-1", "py-[1.25px]"],
         *      }
         * })
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
         * Merge records into string
         * @returns Merged className, last passed value overrides the top
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
         *      },
         *      {
         *          color: "text-blue-100",
         *      }
         * }
         *
         * // text-blue-100 font-bold text-base
         * ```
         */
        mergeProps,
        /**
         * Merge records
         * @returns Merged record, last passed value overrides the top
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
         *      },
         *      {
         *          color: "text-blue-100"
         *      }
         * }
         *
         * //   {
         * //       color: "text-blue-100",
         * //       fontWeight: "font-bold",
         * //       fontSize: "text-base",
         * //   }
         * ```
         */
        mergeRecord,
    }
}
