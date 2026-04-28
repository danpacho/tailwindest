import type {
    FirstDepthNestCondition,
    NestIdentifierSymbols,
    PrefixedNestGroups,
    RemoveIdentifier,
    TailwindestConfig,
    TailwindIdentifier,
    UseArbitraryValue,
    UseArbitraryVariant,
    With,
} from "./types/core"
export type { TailwindestConfig, TailwindestInterface } from "./types/core"

type CombineNestConditionAtCurrentNestStyleProperty<
    NestStyle,
    Identifier extends string = TailwindIdentifier,
    UseArbitrary extends true | false = true,
    NestCondition extends string = FirstDepthNestCondition,
> = {
    [NestKey in keyof NestStyle]?: NestStyle[NestKey] extends string
        ? NestCondition extends FirstDepthNestCondition
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
    Identifier extends string = TailwindIdentifier,
    UseArbitrary extends true | false = true,
    $$Nest$$ extends string = FirstDepthNestCondition,
> = {
    [CurrentNestCondition in Exclude<
        TailwindNestGroups,
        $$Nest$$
    >]?: GetNestStyle<
        Exclude<TailwindNestGroups, CurrentNestCondition | $$Nest$$>,
        Tailwind,
        Identifier,
        UseArbitrary,
        `${$$Nest$$}:${RemoveIdentifier<CurrentNestCondition, Identifier>}`
    >
} & CombineNestConditionAtCurrentNestStyleProperty<
    Tailwind,
    Identifier,
    UseArbitrary,
    $$Nest$$
>

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
type _BaseNestStyle<Config extends TailwindestConfig> = GetNestStyle<
    PrefixedNestGroups<Config>,
    Config["tailwind"],
    NestIdentifierSymbols<Config>,
    UseArbitraryValue<Config>
>

/**
 * Template literal index signature `${string}[${string}]` matches ONLY keys
 * that contain brackets — the Tailwind arbitrary variant pattern:
 *   O "`data-[state=active]`", "`[&_svg]`", "`aria-[expanded=true]`"
 *   X "backgroundColor", "hover", "dark"  (no brackets → unaffected)
 *
 * This preserves exact type inference for all known properties in Base,
 * while allowing arbitrary variant keys with proper nested style type hints.
 * Applied once at the output level — zero recursion cost.
 */
type _WithArbitraryVariant<
    Base,
    Enable extends true | false,
> = Enable extends true
    ? Base & { [K: `${string}[${string}]`]: Base | undefined }
    : Base

export type CreateTailwindest<Config extends TailwindestConfig> =
    _WithArbitraryVariant<_BaseNestStyle<Config>, UseArbitraryVariant<Config>>

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
