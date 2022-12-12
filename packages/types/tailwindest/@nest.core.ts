type IDENTIFIER = ":"
type BREAK_CONDITION_IDENTIFIER = "@"
export type TAILWINDEST_IDENTIFIER = IDENTIFIER | BREAK_CONDITION_IDENTIFIER

/**
 * @example "::before" -> "before"
 */
export type RemoveIdentifier<
    ClassString extends string,
    Identifier extends string = TAILWINDEST_IDENTIFIER
> = ClassString extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassString

/**
 * @example "hover", ":dark" -> "dark:hover"
 */
type CombineConditionAtTargetClass<
    Class,
    ConditionClass extends string
> = Class extends string
    ? ConditionClass extends ""
        ? Class
        : `${RemoveIdentifier<ConditionClass>}${IDENTIFIER}${Class}`
    : Class

type CombineKeyAtObjectProperty<
    NestObject,
    NestedClass extends string,
    NestCondition extends string = ""
> = {
    [NestKey in keyof NestObject]?: NestObject[NestKey] extends string
        ? CombineConditionAtTargetClass<NestObject[NestKey], NestedClass>
        : NestKey extends string
        ? CombineKeyAtObjectProperty<
              NestObject[NestKey],
              `${NestCondition}${IDENTIFIER}${RemoveIdentifier<NestKey>}`
          >
        : never
}

export type TailwindestGetNest<
    NestStyle,
    NestCondition extends string = ""
> = CombineKeyAtObjectProperty<NestStyle, "", NestCondition>

export type TailwindestGetNestWithTitle<
    NestStyle,
    NestedClass extends string,
    NestCondition extends string = ""
> = CombineKeyAtObjectProperty<NestStyle, NestedClass, NestCondition>

/**
 * Remove identifier at child style's key
 */
type CombineNestConditionAtNestStyleProperty<
    NestStyle,
    NestCondition extends string = ""
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? `${RemoveIdentifier<NestCondition>}${IDENTIFIER}${NestStyle[NestKey]}`
        : never
}

/**
 * add nest style
 */
export type GetNestStyle<
    Nest extends string,
    NestStyle,
    NestCondition extends string = ""
> = {
    [key in Exclude<Nest, NestCondition>]?: NestStyle
} & CombineNestConditionAtNestStyleProperty<NestStyle, NestCondition>

type UnusedNestProperty = "transition" | "border"
export type RemoveUnusedNestProperty<Tailwindest> = Omit<
    Tailwindest,
    UnusedNestProperty
>
