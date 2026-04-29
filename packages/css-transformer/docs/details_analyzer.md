# Analyzer Details

The analyzer is the semantic core of `@tailwindest/css-transformer`. It converts
static Tailwind class strings into Tailwindest style records while preserving
enough token information to support both runtime and compiler-oriented output.

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

Example:

```ts
{
    original: "dark:hover:bg-red-950",
    utility: "bg-red-950",
    property: "backgroundColor",
    variants: ["dark", "hover"],
}
```

`original` and `utility` are both required:

- `original` is required for `CreateTailwindest` runtime output.
- `utility` is required for `CreateCompiledTailwindest` compiler output.

## Tokenization

The analyzer splits class strings by whitespace and preserves source order. It
does not normalize, sort, or merge class tokens during tokenization.

Supported inputs:

```ts
analyze("flex dark:hover:bg-red-950")
analyze(["flex", "dark:hover:bg-red-950"])
```

Empty strings produce an empty token list.

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
            backgroundColor: "<leaf>",
        },
    },
}
```

## Output Mode Leaf Selection

`buildObjectTree()` is mode-aware:

```ts
buildObjectTree(tokens, { outputMode: "runtime" })
buildObjectTree(tokens, { outputMode: "compiled" })
```

Runtime mode preserves the source token:

```ts
{
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
}
```

Compiled mode stores only the raw utility:

```ts
{
    dark: {
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
}
```

The default is `runtime` to preserve existing migrations.

## Group Prefixes

When a group prefix is configured, it applies only to variant object keys:

```ts
new TokenAnalyzerImpl(resolver, "$")
```

```ts
{
    $hover: {
        backgroundColor: "bg-accent",
    },
}
```

The group prefix must never be added to leaf class values.

## Collision Policy

When multiple tokens map to the same object leaf, the analyzer promotes the leaf
to an array and preserves source order:

```ts
hover:p-4 hover:p-2
```

Compiled mode:

```ts
{
    hover: {
        padding: ["p-4", "p-2"],
    },
}
```

The analyzer does not run Tailwind merge. It preserves enough information for
Tailwindest runtime or compiler stages to apply their own semantics.

## Diagnostics

If a utility cannot be resolved, the parsed token receives a warning and is
excluded from the generated object tree:

```ts
{
    original: "unknown-xyz",
    utility: "unknown-xyz",
    property: null,
    variants: [],
    warning: "Could not resolve property for utility: unknown-xyz",
}
```

Walkers collect these warnings and decide whether the surrounding source can be
rewritten safely.

## Required Tests

- simple utility records
- runtime nested variant leaves
- compiled nested variant leaves
- deeply nested variants
- arbitrary variants
- group-prefixed variants
- duplicate property array promotion
- unresolved token diagnostics
- mixed supported and unsupported class strings
