type TAILWIND_IDENTIFIER = ":"
type FIRST_DEPTH_NEST_CONDITION = ""

type RemoveIdentifier<
    ClassName extends string,
    Identifier extends string = TAILWIND_IDENTIFIER,
> = ClassName extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassName

type ActiveArbitrary<T extends string> = T | (`${string}` & {})
type WithArray<T> = T | T[]
type With<
    T extends string,
    UseArbitrary extends true | false = true,
> = UseArbitrary extends true ? WithArray<ActiveArbitrary<T>> : WithArray<T>

type CombineNestConditionAtCurrentNestStyleProperty<
    NestStyle,
    Identifier extends string = TAILWIND_IDENTIFIER,
    UseArbitrary extends true | false = true,
    NestCondition extends string = FIRST_DEPTH_NEST_CONDITION,
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? NestCondition extends FIRST_DEPTH_NEST_CONDITION
            ? With<NestStyle[NestKey], UseArbitrary>
            : With<
                  `${RemoveIdentifier<NestCondition, Identifier>}:${NestStyle[NestKey]}`,
                  UseArbitrary
              >
        : never
}

export type GetNestStyle<
    TailwindNestGroups extends string,
    Tailwind,
    NestIdentifierSymbols extends string = TAILWIND_IDENTIFIER,
    UseArbitrary extends true | false = true,
    $$Nest$$ extends string = FIRST_DEPTH_NEST_CONDITION,
> = {
    [CurrentNestCondition in Exclude<
        TailwindNestGroups,
        $$Nest$$
    >]?: GetNestStyle<
        Exclude<TailwindNestGroups, CurrentNestCondition | $$Nest$$>,
        Tailwind,
        NestIdentifierSymbols,
        UseArbitrary,
        `${$$Nest$$}:${RemoveIdentifier<CurrentNestCondition, NestIdentifierSymbols>}`
    >
} & CombineNestConditionAtCurrentNestStyleProperty<
    Tailwind,
    NestIdentifierSymbols,
    UseArbitrary,
    $$Nest$$
>

interface TailwindestConfig {
    /**
     * Tailwind type
     */
    tailwind: any
    /**
     * Tailwind nest group literal type
     */
    tailwindNestGroups: string
    /**
     * Prefix of nest group
     * @default ''
     */
    groupPrefix?: string
    /**
     * Option to enable arbitrary strings
     *
     * If enabled, all `${string}` can be used as valid style property
     */
    useArbitrary?: true | false
}

/**
 * Creates a `tailwindest` typeset.
 *
 * @description Run `npx create-tailwind-type` to generate tailwind type defs. (supported after v4).
 * @see {@link https://github.com/danpacho/tailwindest#create-tailwind-type create-tailwind-type}
 *
 * @augments {any} tailwind - Tailwind type.
 * @augments {string} tailwindNestGroups - Tailwind nest group literal type.
 * @augments {string} groupPrefix - Prefix for nest groups. Defaults to an empty string.
 * @augments {boolean} useArbitrary - Enables arbitrary strings as valid style properties if true.
 */
export type CreateTailwindest<Config extends TailwindestConfig> = GetNestStyle<
    Config["groupPrefix"] extends string
        ? `${Config["groupPrefix"]}${Config["tailwindNestGroups"]}`
        : Config["tailwindNestGroups"],
    Config["tailwind"],
    Config["groupPrefix"] extends string
        ? Config["groupPrefix"] | TAILWIND_IDENTIFIER
        : TAILWIND_IDENTIFIER,
    Config["useArbitrary"] extends boolean ? Config["useArbitrary"] : false
>
