# Output Mode Detection Details

Output mode is intentionally runtime-only.

## Modes

```ts
type CssTransformerOutputMode = "runtime" | "auto"
type CssTransformerResolvedOutputMode = "runtime"
```

`auto` resolves to runtime output. Explicit `runtime` also resolves to runtime
output. Any other mode is invalid.

## Runtime Contract

Runtime mode targets `CreateTailwindest` and preserves the original source token
at each leaf:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
})
```

Nested variant values keep their accumulated Tailwind prefix because
Tailwindest evaluates those objects at runtime.

## Diagnostics

The output mode resolver does not inspect project files, package dependencies,
or source imports. It only validates the requested mode.

## Required Tests

- explicit runtime resolves to runtime
- auto resolves to runtime
- unsupported output modes throw
