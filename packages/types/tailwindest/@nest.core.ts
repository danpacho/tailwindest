/**
 * @description Identifier of `tailwindest` nest conditions
 */
export type TAILWINDEST_IDENTIFIER = ":" | "@"

/**
 * @description Identifier of short-handed version of `tailwindest` nest conditions
 * @description Access condition without commas
 */
export type SHORT_TAILWINDEST_IDENTIFIER = "$"

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
type CombineKeyAtProperty<
    NestObject,
    Condition extends string,
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = {
    [NestKey in keyof NestObject]?: NestKey extends string
        ? CombineKeyAtProperty<
              NestObject[NestKey],
              `${Condition}:${NestKey}`,
              Identifier
          >
        : never
}

export type TailwindestGetNest<
    NestStyle,
    NestCondition extends string = "",
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = CombineKeyAtProperty<NestStyle, NestCondition, Identifier>

/**
 * Combine nest condition at child style property
 */
type CombineNestConditionAtNestStyleProperty<
    NestStyle,
    NestCondition extends string = "",
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? `${RemoveIdentifier<NestCondition, Identifier>}:${NestStyle[NestKey]}`
        : never
}

/**
 * Get nest style
 */
export type GetNestStyle<
    Nest extends string,
    NestStyle,
    NestCondition extends string = "",
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = {
    [Key in Exclude<Nest, NestCondition>]?: Key extends ""
        ? NestStyle
        : GetNestStyle<
              Exclude<Nest, Key | NestCondition>,
              NestStyle,
              `${NestCondition}:${RemoveIdentifier<Key, Identifier>}`,
              Identifier
          >
} & CombineNestConditionAtNestStyleProperty<
    NestStyle,
    NestCondition,
    Identifier
>

type UnusedNestProperty = "transition"
/**
 * Remove condition, what should not be used from the second depth or higher
 */
export type RemoveUnusedNestProperty<Tailwind> = Omit<
    Tailwind,
    UnusedNestProperty
>
