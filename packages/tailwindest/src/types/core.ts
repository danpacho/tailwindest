export type TailwindIdentifier = ":"
export type FirstDepthNestCondition = ""

export type RemoveIdentifier<
    ClassName extends string,
    Identifier extends string = TailwindIdentifier,
> = ClassName extends `${Identifier}${infer RemovedClassString}`
    ? RemoveIdentifier<RemovedClassString, Identifier>
    : ClassName

export type ActiveArbitrary<T extends string> = T | (`${string}` & {})
export type WithArray<T> = T | T[]
export type With<
    T extends string,
    UseArbitrary extends true | false = true,
> = UseArbitrary extends true ? WithArray<ActiveArbitrary<T>> : WithArray<T>

export interface TailwindestConfig {
    /**
     * Tailwind type.
     */
    tailwind: any
    /**
     * Tailwind variant/nest key literal union.
     */
    tailwindNestGroups: string
    /**
     * Prefix of nest group.
     *
     * @defaultValue `""`
     */
    groupPrefix?: string
    /**
     * Enables arbitrary strings as valid style values if `true`.
     */
    useArbitrary?: true | false
    /**
     * Enables arbitrary variants such as `data-[state=active]`,
     * `[&_svg]`, or `aria-[expanded=true]` as object keys.
     *
     * @defaultValue `false`
     */
    useArbitraryVariant?: true | false
}

export interface TailwindestInterface {
    /**
     * Tailwind literal typeset.
     */
    tailwindLiteral?: any
    /**
     * Tailwindest style object typeset.
     */
    tailwindest: any
    /**
     * Enables arbitrary strings as valid style values if `true`.
     */
    useArbitrary?: true | false
    /**
     * Use typed class literal strings for extra classes.
     */
    useTypedClassLiteral?: true | false
}

export type PrefixedNestGroups<Config extends TailwindestConfig> =
    Config["groupPrefix"] extends string
        ? `${Config["groupPrefix"]}${Config["tailwindNestGroups"]}`
        : Config["tailwindNestGroups"]

export type NestIdentifierSymbols<Config extends TailwindestConfig> =
    Config["groupPrefix"] extends string
        ? Config["groupPrefix"] | TailwindIdentifier
        : TailwindIdentifier

export type UseArbitraryValue<Config extends TailwindestConfig> =
    Config["useArbitrary"] extends boolean ? Config["useArbitrary"] : false

export type UseArbitraryVariant<Config extends TailwindestConfig> =
    Config["useArbitraryVariant"] extends true ? true : false
