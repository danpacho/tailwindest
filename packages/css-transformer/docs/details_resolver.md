# Resolver Details

The CSS transformer delegates Tailwind utility classification to
`create-tailwind-type` through `CSSPropertyResolver`. The resolver is
typeset-aware: it returns Tailwindest generated record keys, not arbitrary CSS
declaration property names. The transformer does not maintain a separate
Tailwind utility table because that would drift from the generated Tailwind type
data.

## Contract

The resolver receives a raw utility token with variants removed:

```text
input class token: dark:hover:bg-red-950
resolver input:     bg-red-950
resolver output:    backgroundColor
```

For directional utilities, the output follows the generated `Tailwind`
interface:

```text
input class token: group-has-[[data-sidebar=menu-action]]/menu-item:pr-8
resolver input:     pr-8
resolver output:    padding
```

Even though Tailwind compiles `pr-8` to `padding-right`, `paddingRight` is not a
valid transformer output unless the active generated `Tailwind` interface
contains that record key.

The analyzer, not the resolver, owns variant nesting. Leaves use the original
source token.

```ts
interface CSSPropertyResolver {
    resolveUnambiguous(className: string): string | null
}
```

Resolver return values become Tailwindest object property keys:

```ts
{
    backgroundColor: "dark:hover:bg-red-950"
    padding: "group-has-[[data-sidebar=menu-action]]/menu-item:pr-8"
}
```

## Responsibilities

- Resolve known Tailwind utilities to generated Tailwindest record keys.
- Use the generated `Tailwind` interface as namespace authority.
- Use Tailwind compiler CSS signatures to disambiguate semantic cases such as
  typography vs color or ring utilities, not as standalone object-key names.
- Return `null` when the utility is unknown or ambiguous.
- Keep arbitrary value utilities intact when the family is known.
- Avoid interpreting variant prefixes.

## Non-Responsibilities

- Do not decide source-order conflict behavior.
- Do not parse arbitrary value internals unless `create-tailwind-type` already
  supports that utility family.
- Do not synthesize Tailwind utilities that were not present in source.

## Variant Handling Boundary

The analyzer strips variants before resolver lookup. This keeps all of these
tokens resolver-compatible:

```text
hover:bg-accent             -> bg-accent
dark:hover:bg-accent        -> bg-accent
data-[state=open]:bg-accent -> bg-accent
```

If the stripped utility cannot be resolved, the token remains unsupported and
the caller decides whether to preserve the original source.

## Ambiguity Policy

`resolveUnambiguous()` may return `null` for utilities that cannot be proven to
belong to a generated Tailwindest record key. The transformer must not guess. A
guessed key can produce valid TypeScript while changing styling behavior, and a
raw CSS declaration key can produce invalid TypeScript.

Ambiguous classes must produce diagnostics and should preserve the original
class expression when exact migration is not possible.

## Production Requirements

Resolver integration is production-ready only when:

- every analyzer call passes variant-stripped utility tokens
- unresolved utilities are surfaced as warnings
- no walker silently drops unresolved tokens
- resolver misses are covered by tests
- generated output typechecks against the actual Tailwindest typeset, not only
  mock generated types
- shadcn registry fixtures continue to pass

## Required Tests

- known utility resolution
- unknown utility diagnostics
- ambiguous utility fallback
- variant-prefixed class stripping
- arbitrary values and arbitrary variants
- negative values
- color, spacing, layout, typography, border, effect, transition, and transform
  families when supported by the generated resolver
