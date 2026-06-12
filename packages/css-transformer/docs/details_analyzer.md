# Analyzer Details

The analyzer converts static Tailwind class strings into Tailwindest runtime
style records.

## Data Model

```ts
interface ParsedToken {
    original: string
    utility: string
    property: string | null
    variants: string[]
    warning?: string
}
```

`utility` is used only for resolver lookup. Generated object leaves always use
`original`.

The analyzer also exposes a lossless class-source plan:

```ts
type ClassSourcePlan = {
    source: string
    tokens: ClassSourceToken[]
    structuredTokens: StructuredClassToken[]
    preservedTokens: PreservedClassToken[]
    styleTree: Record<string, any>
}
```

`tokens.map((token) => token.original)` must equal the source token stream from
`splitClassString(source)`. `styleTree` is built only from structured tokens.
Preserved tokens remain available to walkers for `tw.def(...)` or raw
`tw.join(...)` serialization.

## Variant Extraction

Variant prefixes are extracted before resolver lookup:

```text
dark:hover:bg-red-950
│    │     └─ utility: bg-red-950
│    └─────── variant: hover
└──────────── variant: dark
```

The object path is built from variants first and the resolved property key last:

```ts
{
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
}
```

## Group Prefixes

When a group prefix is configured, it applies only to variant object keys:

```ts
new TokenAnalyzerImpl(resolver, "$")
```

```ts
{
    $hover: {
        backgroundColor: "hover:bg-accent",
    },
}
```

## Collision Policy

When multiple tokens map to the same object leaf, the analyzer promotes the leaf
to an array and preserves source order:

```ts
{
    hover: {
        padding: ["hover:p-4", "hover:p-2"],
    },
}
```

The analyzer does not run Tailwind merge.

## Diagnostics

If a utility cannot be resolved, the parsed token receives a warning and is
excluded from the generated object tree. In the lossless plan, that same token
is also classified as:

```ts
{
    kind: "preserved",
    property: null,
    reason: "unresolved-property",
}
```

Walkers must treat this as preservation metadata, not as permission to drop the
class token.

## Required Tests

- simple utility records
- runtime nested variant leaves
- deeply nested variants
- arbitrary variants
- group-prefixed variants
- duplicate property array promotion
- unresolved token diagnostics
- lossless `plan()` source/token/style-tree consistency
- mixed supported and unsupported class strings
