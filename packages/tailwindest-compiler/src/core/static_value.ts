/**
 * Object form accepted by class-list APIs such as `join()`.
 *
 * Truthy values include the object key in the generated class string; falsy
 * values omit it.
 *
 * @public
 */
export type StaticClassDictionary = Record<string, unknown>

/**
 * Statically known class-list value accepted by the evaluator and per-call
 * compiler API.
 *
 * @public
 */
export type StaticClassValue =
    | StaticClassValue[]
    | StaticClassDictionary
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined

/**
 * Statically known style-object leaf value.
 *
 * @public
 */
export type StaticStyleValue =
    | StaticStyleObject
    | StaticStyleValue[]
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined

/**
 * Statically known Tailwindest style object.
 *
 * String leaves are Tailwind class tokens. Nested objects model grouped or
 * variant-aware style declarations that are flattened at build time.
 *
 * @public
 */
export interface StaticStyleObject {
    [key: string]: StaticStyleValue
}
