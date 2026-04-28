# Resolver Design

The resolver maps Tailwind utility tokens to Tailwindest object keys. It is
intentionally deterministic and table-driven.

## Responsibilities

- Recognize supported Tailwind utility families.
- Return the Tailwindest property path for each token.
- Preserve the original token as the leaf value.
- Report unsupported or ambiguous tokens.

## Resolver Contract

```ts
interface TokenResolver {
    resolve(token: string): ResolveResult
}

type ResolveResult =
    | { kind: "resolved"; path: string[]; value: string }
    | { kind: "unresolved"; token: string; reason: string }
```

## Supported Families

The production resolver should cover common layout, spacing, typography,
border, color, background, effects, transition, transform, and state utility
families used by application UI code.

Unsupported families are allowed, but they must be explicit diagnostics rather
than silent omissions.

## Arbitrary Values

Arbitrary values are preserved as leaf strings when the utility family is known:

```text
bg-[color:var(--surface)]
```

The resolver should not attempt to parse arbitrary value internals unless a
specific production rule requires it.

## Conflict Policy

The resolver does not decide final conflict precedence. It only maps tokens.
The analyzer owns merge order and override behavior.

## Test Coverage

Required tests:

- known utility families
- unknown utility family
- arbitrary values
- negative values
- variant-prefixed tokens
- unsupported syntax diagnostics
