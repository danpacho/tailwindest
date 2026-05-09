export type TailwindIdentifier = ":"
export type FirstDepthNestCondition = ""
type TailwindDynamicNestGroupPrefix = "aria" | "data"
type TailwindCompoundDynamicNestGroupPrefix =
    | "group"
    | "peer"
    | "not"
    | "has"
    | "in"
export type TailwindArbitraryNestGroup =
    | `[${string}]${string}`
    | `@[${string}]${string}`
    | `${string}-[${string}]${string}`
    | `${TailwindDynamicNestGroupPrefix}-${string}`
    | `${TailwindCompoundDynamicNestGroupPrefix}-${TailwindDynamicNestGroupPrefix}-${string}`

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
     * Enables arbitrary variants and dynamic named variants such as
     * `data-[state=active]`, `[&_svg]`, `aria-[expanded=true]`,
     * `aria-invalid`, or `group-aria-invalid` as object keys.
     *
     * @defaultValue `false`
     */
    useArbitraryNestGroups?: true | false
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

export type PrefixedArbitraryNestGroups<Config extends TailwindestConfig> =
    UseArbitraryNestGroups<Config> extends true
        ? Config["groupPrefix"] extends string
            ? `${Config["groupPrefix"]}${TailwindArbitraryNestGroup}`
            : TailwindArbitraryNestGroup
        : never

export type NestIdentifierSymbols<Config extends TailwindestConfig> =
    Config["groupPrefix"] extends string
        ? Config["groupPrefix"] | TailwindIdentifier
        : TailwindIdentifier

export type UseArbitraryValue<Config extends TailwindestConfig> =
    Config["useArbitrary"] extends boolean ? Config["useArbitrary"] : false

export type UseArbitraryNestGroups<Config extends TailwindestConfig> =
    Config["useArbitraryNestGroups"] extends true ? true : false
