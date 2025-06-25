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
     * Enables arbitrary strings as valid style properties if `true`.
     */
    useArbitrary?: true | false
}

export interface TailwindestInterface {
    /**
     * Tailwind literal typeset
     */
    tailwindLiteral?: any
    /**
     * Tailwindest typeset
     */
    tailwindest: any
    /**
     * Enables arbitrary strings as valid style properties if `true`.
     */
    useArbitrary?: true | false
    /**
     * Use typed class literal strings for extra classes
     */
    useTypedClassLiteral?: true | false
}

/**
 * Create tailwindest typeset
 *
 * @description Run `npx create-tailwind-type` to generate tailwind type defs.
 * ```bash
 * npx create-tailwind-type --base node_modules/tailwindcss --no-arbitrary-value --disable-variants
 * ```
 * @see {@link https://github.com/danpacho/tailwindest#create-tailwind-type create-tailwind-type}
 *
 * @example
 * ```ts
 * // 1. import generated types
 * import type { Tailwind, TailwindNestGroups } from "~/tailwind.ts"
 *
 * // 2. create type
 * export type Tailwindest = CreateTailwindest<{
 *      tailwind: Tailwind
 *      tailwindNestGroups: TailwindNestGroups
 *      useArbitrary: true
 *      useTypedClassLiteral: true
 *      groupPrefix: "#" // optional
 * }>
 * ```
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

/**
 * Create tailwind literal typeset
 *
 * @description Run `npx create-tailwind-type` to generate tailwind type defs.
 * ```bash
 * npx create-tailwind-type --base node_modules/tailwindcss --no-arbitrary-value --disable-variants
 * ```
 * @see {@link https://github.com/danpacho/tailwindest#create-tailwind-type create-tailwind-type}
 *
 * @example
 * ```ts
 * // 1. import generated types
 * import type { Tailwind, TailwindNestGroups } from "~/tailwind.ts"
 *
 * // 2. create type
 * export type TailwindLiteral = CreateTailwindLiteral<Tailwind>
 * ```
 */
export type CreateTailwindLiteral<Tailwind> = Tailwind[keyof Tailwind]
