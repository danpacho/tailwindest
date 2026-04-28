import type {
    PrefixedNestGroups,
    TailwindestConfig,
    UseArbitraryValue,
    UseArbitraryVariant,
    With,
} from "./types/core"

type CompiledNestStyleProperty<
    Tailwind,
    UseArbitrary extends true | false = true,
> = {
    [NestKey in keyof Tailwind]?: Tailwind[NestKey] extends string
        ? With<Tailwind[NestKey], UseArbitrary>
        : never
}

type CompiledNestLeaf<Tailwind, UseArbitrary extends true | false = true> =
    Extract<Tailwind[keyof Tailwind], string> extends infer Leaf extends string
        ? With<Leaf, UseArbitrary>
        : never

type CompiledNestValue<
    TailwindNestGroups extends string,
    Tailwind,
    UseArbitrary extends true | false = true,
> =
    | GetCompiledNestStyle<TailwindNestGroups, Tailwind, UseArbitrary>
    | CompiledNestLeaf<Tailwind, UseArbitrary>

type CompiledNestKeys<
    TailwindNestGroups extends string,
    Tailwind,
    UseArbitrary extends true | false = true,
> = string extends TailwindNestGroups
    ? {
          [CurrentNestCondition: string]:
              | CompiledNestValue<TailwindNestGroups, Tailwind, UseArbitrary>
              | undefined
      }
    : {
          [CurrentNestCondition in TailwindNestGroups]?: GetCompiledNestStyle<
              TailwindNestGroups,
              Tailwind,
              UseArbitrary
          >
      }

export type GetCompiledNestStyle<
    TailwindNestGroups extends string,
    Tailwind,
    UseArbitrary extends true | false = true,
> = CompiledNestKeys<TailwindNestGroups, Tailwind, UseArbitrary> &
    CompiledNestStyleProperty<Tailwind, UseArbitrary>

type _BaseCompiledNestStyle<Config extends TailwindestConfig> =
    GetCompiledNestStyle<
        PrefixedNestGroups<Config>,
        Config["tailwind"],
        UseArbitraryValue<Config>
    >

/**
 * Template literal index signature `${string}[${string}]` matches Tailwind
 * arbitrary variant object keys such as `data-[state=active]`, `[&_svg]`, and
 * `aria-[expanded=true]`.
 */
type _WithCompiledArbitraryVariant<
    Base,
    Enable extends true | false,
> = Enable extends true
    ? Base & { [K: `${string}[${string}]`]: Base | undefined }
    : Base

/**
 * Create the compiler-oriented Tailwindest style type.
 *
 * Unlike {@link CreateTailwindest}, this type keeps variant prefixes in object
 * keys only. Nested leaf values remain raw Tailwind utility literals, because
 * the compiler/runtime normalizer generates `dark:`, `hover:`, and other
 * prefixes from the object path at build time.
 *
 * @example
 * ```ts
 * type Style = CreateCompiledTailwindest<{
 *     tailwind: Tailwind
 *     tailwindNestGroups: TailwindNestGroups
 * }>
 *
 * const box: Style = {
 *     dark: {
 *         backgroundColor: "bg-red-900",
 *         hover: {
 *             backgroundColor: "bg-red-950",
 *         },
 *     },
 * }
 * ```
 */
export type CreateCompiledTailwindest<Config extends TailwindestConfig> =
    _WithCompiledArbitraryVariant<
        _BaseCompiledNestStyle<Config>,
        UseArbitraryVariant<Config>
    >
