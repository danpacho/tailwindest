# Resolver Details

The CSS transformer delegates Tailwind utility classification to
`create-tailwind-type` through `CSSPropertyResolver`. The transformer does not
maintain a separate Tailwind utility table because that would drift from the
generated Tailwind type data.

## Contract

The resolver receives a raw utility token with variants removed:

```text
input class token: dark:hover:bg-red-950
resolver input:     bg-red-950
resolver output:    backgroundColor
```

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
}
```

## Responsibilities

- Resolve known Tailwind utilities to Tailwindest property keys.
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

`resolveUnambiguous()` may return `null` for utilities that map to multiple
possible CSS properties. The transformer must not guess. A guessed property can
produce valid TypeScript while changing styling behavior.

Ambiguous classes must produce diagnostics and should preserve the original
class expression when exact migration is not possible.

## Production Requirements

Resolver integration is production-ready only when:

- every analyzer call passes variant-stripped utility tokens
- unresolved utilities are surfaced as warnings
- no walker silently drops unresolved tokens
- resolver misses are covered by tests
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
