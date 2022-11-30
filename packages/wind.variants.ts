import type { WindVariantsKey } from "./wind"

/**
 * @note Get variants type set of `wind$` or `createVariants`
 * @returns Type `string union` or `object` or `never`
 * @example
 * // ✅ Get "success" | "fail"
 * type Variants = WindVariants<typeof btnSuccessFail>
 *
 *  // ✅ Get { size: "sm" | "md" | "lg", type: "success" | "fail" }
 * type ComplexVariants = WindVariants<typeof complexBtn>
 *
 * // ❌ Get never
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
