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
 * @description remove identifier from class name
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
    Identifier extends string = TAILWINDEST_IDENTIFIER,
> = ClassName extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassName

type FIRST_DEPTH_NEST_CONDITION = ""

/**
 * @description combine nest condition at current style sheet
 */
type CombineNestConditionAtCurrentStyleSheet<
    NestStyle,
    NestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
    Identifier extends string = TAILWINDEST_IDENTIFIER,
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? NestCondition extends FIRST_DEPTH_NEST_CONDITION
            ? NestStyle[NestKey]
            : `${RemoveIdentifier<
                  NestCondition,
                  Identifier
              >}:${NestStyle[NestKey]}`
        : never
}

/**
 * @description get deeply nested style sheet
 */
export type GetNestStyleSheet<
    AllNestConditions extends string,
    StyleSheet,
    ParentNestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
    Identifier extends string = TAILWINDEST_IDENTIFIER,
> = {
    [CurrentNestCondition in Exclude<
        AllNestConditions,
        ParentNestCondition
    >]?: GetNestStyleSheet<
        Exclude<AllNestConditions, CurrentNestCondition | ParentNestCondition>,
        StyleSheet,
        `${ParentNestCondition}:${RemoveIdentifier<
            CurrentNestCondition,
            Identifier
        >}`,
        Identifier
    >
} & CombineNestConditionAtCurrentStyleSheet<
    StyleSheet,
    ParentNestCondition,
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
