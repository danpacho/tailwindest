export type ClassName = string
export type CacheKey = string | symbol | number
/**
 * @description Cache data set of style generators
 */
export type StyleGeneratorCache<StyleType> = [StyleType, ClassName]

/**
 * @description Stylesheet type restriction, some kind of deeply nested object type definition
 */
export type NestedObject = Record<string, unknown>

type Truthy = "true"
type Falsy = "false"
/**
 * @description Get valid `object` key type
 * @returns `boolean` | `string` | `number`
 * @example
 * ```ts
 * type Inferred = GetVariantsKey<'true'>
 * // true
 * type Inferred = GetVariantsKey<'false'>
 * // false
 * type Inferred = GetVariantsKey<'true' | 'false'>
 * // boolean
 * type Inferred = GetVariantsKey<'true' | 'false' | 'hi'>
 * // boolean | 'hi'
 * type Inferred = GetVariantsKey<'true' | 'false' | 'hi' | 1>
 * // boolean | 'hi' | 1
 * type Inferred = GetVariantsKey<undefined>
 * // 'Error: typeof variants key should be <string> | <number> | <'true' | 'false'>'
 * ```
 */
export type GetVariantsKey<VariantsKey> = VariantsKey extends string | number
    ? VariantsKey extends Truthy
        ? VariantsKey extends Falsy
            ? boolean
            : true
        : VariantsKey extends Falsy
        ? false
        : VariantsKey
    : "Error: typeof variants key should be <string> | <number> | <'true' | 'false'>"

export type UndefinableString = string | undefined
