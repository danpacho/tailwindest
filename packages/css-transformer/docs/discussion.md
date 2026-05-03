# CSS Transformer Production Discussion

`tailwindest-css-transform` is a migration tool. It rewrites supported
class-string source patterns into Tailwindest runtime authoring.

## Runtime Output Only

The transformer emits `CreateTailwindest`-compatible object leaves. Nested
variant leaves preserve the original class token:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
})
```

The transformer does not strip variant prefixes from leaves.

## Walker Boundary

`className`, `cn`, `clsx`, `classNames`, and `cva` all share the same analyzer.
Walkers collect static class strings and ask the analyzer to build runtime
Tailwindest object trees.

## Dynamic Expressions

Unsupported dynamic expressions are preserved. Rewriting only happens when the
transformer can prove a static class string shape.
