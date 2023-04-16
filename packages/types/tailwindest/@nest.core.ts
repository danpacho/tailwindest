export type TAILWINDEST_IDENTIFIER = ":" | "@"

/**
 * @example
 * ```ts
 * //pseudo type visualization
 * const className = "::before"
 * // adjust type
 * const typeResult = "before"
 * ```
 */
export type RemoveIdentifier<
    ClassName extends string,
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = ClassName extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassName

/**
 * Combine parent object key at child properties
 * @example
 * ```ts
 * //pseudo type visualization
 * const nested = {
 *     "@key": {
 *          a: "a",
 *          b: "b"
 *     }
 * }
 * // adjust type
 * const typeResult = {
 *     "@key": {
 *          a: "@key:a",
 *          b: "@key:b"
 *      }
 * }
 * ```
 */
type CombineKeyAtProperty<NestObject, Condition extends string> = {
    [NestKey in keyof NestObject]?: NestKey extends string
        ? CombineKeyAtProperty<
              NestObject[NestKey],
              `${Condition}:${RemoveIdentifier<NestKey>}`
          >
        : never
}

export type TailwindestGetNest<
    NestStyle,
    NestCondition extends string = ""
> = CombineKeyAtProperty<NestStyle, NestCondition>

/**
 * Combine nest condition at child style property
 */
type CombineNestConditionAtNestStyleProperty<
    NestStyle,
    NestCondition extends string = ""
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? `${RemoveIdentifier<NestCondition>}:${NestStyle[NestKey]}`
        : never
}

/**
 * Get nest style
 */
export type GetNestStyle<
    Nest extends string,
    NestStyle,
    NestCondition extends string = ""
> = {
    [Key in Exclude<Nest, NestCondition>]?: Key extends ""
        ? NestStyle
        : GetNestStyle<
              Exclude<Nest, Key | NestCondition>,
              NestStyle,
              `${NestCondition}:${RemoveIdentifier<Key>}`
          >
} & CombineNestConditionAtNestStyleProperty<NestStyle, NestCondition>

type UnusedNestProperty = "transition"
/**
 * Remove condition, what should not be used from the second depth or higher
 */
export type RemoveUnusedNestProperty<Tailwind> = Omit<
    Tailwind,
    UnusedNestProperty
>
