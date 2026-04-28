# Analyzer Design

The analyzer converts Tailwind class strings into structured Tailwindest style
records. It is the semantic core of the CSS transformer.

## Inputs

- A class string from JSX, `cn`, `clsx`, or `cva`.
- A `TokenResolver` capable of resolving utility tokens.
- Optional context about variants or grouping.

## Outputs

```ts
interface AnalyzeResult {
    record: Record<string, unknown>
    unresolved: string[]
    diagnostics: TransformerDiagnostic[]
}
```

## Token Handling

The analyzer splits class strings by whitespace, preserves token order, and
resolves each token independently. Resolved tokens are merged into a style
record. Unresolved tokens remain in diagnostics so the caller can decide whether
to preserve the original expression.

## Variant Handling

Variant prefixes become nested object keys:

```ts
"dark:hover:bg-red-950"
```

becomes:

```ts
{
    dark: {
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
}
```

The analyzer does not guess unknown prefixes. Unknown prefixes are reported and
the caller should preserve the original source when exact conversion cannot be
proven.

## Merge Behavior

Multiple tokens that map to the same property are applied in source order. The
last compatible token wins, matching Tailwind class precedence for static
strings.

Arrays are used only where the Tailwindest style model expects multiple
classes for one property.

## Diagnostics

Diagnostics must include:

- token text
- reason
- source span when available
- severity

The transformer should never silently drop unresolved classes.

## Test Coverage

Required tests:

- simple utility classes
- stacked variants
- arbitrary values
- duplicate property override
- unresolved token preservation
- mixed supported and unsupported classes
