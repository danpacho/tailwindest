/**
 * @description tailwind class nest divider
 */
type NEST_DIVIDER = ":"

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
    Identifier extends string,
> = ClassName extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassName

// default parent nest condition value
type FIRST_DEPTH_NEST_CONDITION = ""
/**
 * @description combine nest condition at current style sheet
 */
type CombineNestConditionAtCurrentStyleSheet<
    NestStyle,
    Identifier extends string,
    NestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? NestCondition extends FIRST_DEPTH_NEST_CONDITION
            ? NestStyle[NestKey]
            : `${RemoveIdentifier<
                  NestCondition,
                  // should remove nest divider
                  Identifier | NEST_DIVIDER
              >}${NEST_DIVIDER}${NestStyle[NestKey]}`
        : never
}

/**
 * @description get deeply nested style sheet
 */
export type GetNestStyleSheet<
    AllNestConditions extends string,
    StyleSheet,
    Identifier extends string,
    ParentNestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
> = {
    [CurrentNestCondition in Exclude<
        AllNestConditions,
        ParentNestCondition
    >]?: GetNestStyleSheet<
        Exclude<AllNestConditions, CurrentNestCondition | ParentNestCondition>,
        StyleSheet,
        Identifier,
        `${ParentNestCondition}${NEST_DIVIDER}${RemoveIdentifier<
            CurrentNestCondition,
            Identifier
        >}`
    >
} & CombineNestConditionAtCurrentStyleSheet<
    StyleSheet,
    Identifier,
    ParentNestCondition
>

/**
 * @description extended nest condition, `group` or `peer`
 */
export type TAILWIND_EXTENDED_NEST_CONDITION = "group" | "peer"
type EXTENDED_CONDITION_DIVIDER = "-"

/**
 * @description get deeply nested extended(`group`, `peer`) style sheet
 */
export type GetNestExtendedStyleSheet<
    AllNestConditions extends string,
    StyleSheet,
    ExtendedNestCondition extends TAILWIND_EXTENDED_NEST_CONDITION,
    Identifier extends string,
    ParentNestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
> = ParentNestCondition extends FIRST_DEPTH_NEST_CONDITION
    ? {
          [CurrentNestCondition in Exclude<
              AllNestConditions,
              ParentNestCondition
          >]?: GetNestStyleSheet<
              Exclude<
                  AllNestConditions,
                  CurrentNestCondition | ParentNestCondition
              >,
              StyleSheet,
              Identifier,
              `${ExtendedNestCondition}${EXTENDED_CONDITION_DIVIDER}${RemoveIdentifier<
                  CurrentNestCondition,
                  Identifier
              >}`
          >
      }
    : {
          [CurrentNestCondition in Exclude<
              AllNestConditions,
              ParentNestCondition
          >]?: GetNestStyleSheet<
              Exclude<
                  AllNestConditions,
                  CurrentNestCondition | ParentNestCondition
              >,
              StyleSheet,
              Identifier,
              `${ParentNestCondition}${NEST_DIVIDER}${RemoveIdentifier<
                  CurrentNestCondition,
                  Identifier
              >}`
          >
      } & CombineNestConditionAtCurrentStyleSheet<
          StyleSheet,
          Identifier,
          ParentNestCondition
      >

type UnusedNestProperty = "transition"
/**
 * Remove condition, what should not be used from the second depth or higher
 */
export type RemoveUnusedNestProperty<Tailwind> = Omit<
    Tailwind,
    UnusedNestProperty
>
