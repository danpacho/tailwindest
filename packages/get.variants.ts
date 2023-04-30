/**
 * @description Get variants type of `rotary` and `variants`
 * @example
 * ```ts
 * // ✅ rotary
 * const rotaryBtn = tw.rotary({
 *      success: {},
 *      fail: {},
 * })
 * type InferredRotary = GetVariants<typeof rotaryBtn>
 * type InferredRotary = "success" | "fail"
 *
 * // ✅ variants
 * const complexBtn = tw.variants({
 *      size: {
 *          sm: {},
 *          md: {},
 *          lg: {},
 *      },
 *      fail: {
 *          success: {},
 *          fail: {},
 *      }
 * })
 * type InferredVariants = GetVariants<typeof complexBtn>
 * type InferredVariants = {
 *      size?: "sm" | "md" | "lg"
 *      type?: "success" | "fail"
 * }
 *
 * // ❌ never
 * const never = tw.toggle({
 *      truthy: {},
 *      falsy: {}
 * })
 * type InferredToggle = GetVariants<typeof never>
 * type InferredToggle = never
 * ```
 */
export type GetVariants<TypeofVariants> = TypeofVariants extends {
    class: (variants: infer Variants) => unknown
}
    ? Variants extends string
        ? Variants
        : Partial<Variants>
    : never
