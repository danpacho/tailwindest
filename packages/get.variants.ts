/**
 * @description Get variants type of `rotary` and `variants`
 * @example
 * ```ts
 * // 🛠️ rotary
 * const rotaryBtn = tw.rotary({
 *      success: {},
 *      fail: {},
 *      true: {}, // only truthy boolean
 * })
 * type InferredRotary = GetVariants<typeof rotaryBtn>
 * type InferredRotary = "success" | "fail" | true
 *
 * // 🛠️ variants
 * const complexBtn = tw.variants({
 *      variants: {
 *          size: {
 *              sm: {},
 *              md: {},
 *              lg: {},
 *          },
 *          fail: {
 *              success: {},
 *              fail: {},
 *          },
 *          light: {
 *              true: {}, // truthy boolean
 *              false: {}, // falsy boolean
 *          }
 *      }
 * })
 * type InferredVariants = GetVariants<typeof complexBtn>
 * type InferredVariants = {
 *      size?: "sm" | "md" | "lg"
 *      type?: "success" | "fail"
 *      light?: boolean
 * }
 *
 * // 🚫 never
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
