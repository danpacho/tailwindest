import type { VariantsList } from "./wind"

/**
 * @description Get variants type of `wind$`, `createVariants`
 * @example
 * ```ts
 * // ✅ < wind$ >
 * type Variants = WindVariants<typeof btnSuccessFail>
 * type VariantsResult = "success" | "fail"
 *
 * // ✅ < createVariants >
 * type ComplexVariants = WindVariants<typeof complexBtn>
 * type ComplexVariantsResult = {
 *      size?: "sm" | "md" | "lg" | undefined
 *      type?: "success" | "fail" | undefined
 * }
 *
 * // ❌ < wind >
 * type NoVariants = WindVariants<typeof btnNoVariants>
 * type NoVariantsResult = never
 * ```
 */
export type WindVariants<TypeofWind> = TypeofWind extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? VariantsList<Variants>
        : never
    : TypeofWind extends (VariantsOption: infer VariantsOption) => unknown
    ? VariantsOption
    : never
