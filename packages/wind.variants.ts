import { WindVariantsKey } from "./wind"

/**
 * @note Get variants `union` of `wind`
 * @returns Type `string union` or `never`
 * @example
 * // ✅ Get "success" | "fail"
 * type BtnVariants = WindVariants<typeof SUCCESS_FAIL_BTN>
 *
 * // ❌ Get never
 * type BtnVariants2 = WindVariants<typeof NO_VARIANTS_BTN>
 */
export type WindVariants<TypeofWind> = TypeofWind extends {
    style: (variants: infer Variants) => unknown
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? WindVariantsKey<Variants>
        : never
    : TypeofWind extends (variants: infer Variants) => unknown
    ? WindVariantsKey<Variants>
    : never
