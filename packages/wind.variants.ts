import type { WindVariantsKey } from "./wind"

/**
 * @description Get variants type set at `wind$` or `createVariants`
 * @returns Type `string union` or `object` or `never`
 * @example
 * // ✅ "success" | "fail"
 * type Variants = WindVariants<typeof btnSuccessFail>
 *
 * // ✅ { bg: "red" | "blue", type: "success" | "fail" }
 * type ComplexVariants = WindVariants<typeof complexBtn>
 *
 * // ❌ never
 * type NoVariants = WindVariants<typeof btnNoVariants>
 */
export type WindVariants<TypeofWind> = TypeofWind extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? WindVariantsKey<Variants>
        : never
    : TypeofWind extends (VariantsOption: infer VariantsOption) => unknown
    ? VariantsOption
    : never
