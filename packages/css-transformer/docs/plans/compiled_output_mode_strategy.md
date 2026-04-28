# Compiled Output Mode Strategy

`@tailwindest/css-transformer` must support two different Tailwindest authoring
targets without silently changing semantics:

- Runtime Tailwindest users that consume `CreateTailwindest`.
- Compiler Tailwindest users that consume `CreateCompiledTailwindest`.

The distinction is critical for nested variants. Runtime Tailwindest expects the
leaf value to include the full Tailwind variant prefix. Compiler Tailwindest
expects variant prefixes to come only from the object path, with raw utility
values at the leaf.

## Assumptions

- The transformer is a migration tool and must prefer conservative output over
  speculative rewrites.
- Existing runtime users are the compatibility baseline.
- Compiler users need an explicit or confidently detected output contract.
- Package installation alone is not enough evidence that a project wants
  compiler-oriented output.

## Output Contracts

Runtime mode preserves the original class token at the style leaf:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
})
```

Compiled mode stores only the raw utility at the style leaf:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
})
```

The analyzer must not hard-code either contract. It must receive the output mode
from transformer context and choose the leaf value accordingly.

```ts
type CssTransformerOutputMode = "runtime" | "compiled" | "auto"

const leafValue =
    context.outputMode === "compiled" ? token.utility : token.original
```

## Detection Priority

Automatic detection is allowed only when the signal is strong enough to avoid
breaking runtime users.

| Priority | Signal                                                                                               | Decision                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1        | CLI/API option: `mode: "runtime" \| "compiled"`                                                      | Use exactly as requested.                                                                |
| 2        | Tailwindest config declares transformer/compiler output mode                                         | Use config mode.                                                                         |
| 3        | Vite config uses `@tailwindest/compiler/vite` or `tailwindest()` compiler plugin                     | Use compiled mode.                                                                       |
| 4        | Next/precompile bridge imports `createCompilerContext` from `@tailwindest/compiler`                  | Use compiled mode for that transform run.                                                |
| 5        | Source imports `CreateCompiledTailwindest` or compiler-only Tailwindest types                        | Use compiled mode for that file when no stronger project mode exists.                    |
| 6        | Compiler artifacts exist, such as `.tailwindest/debug-manifest.json` or an `@source inline()` bridge | Treat as probable compiled mode; require confirmation unless paired with another signal. |
| 7        | `package.json` includes `@tailwindest/compiler`                                                      | Weak signal only; do not switch modes by itself.                                         |
| 8        | Unknown                                                                                              | Default to runtime mode.                                                                 |

## Configuration Surface

The transformer should expose a small, explicit API:

```ts
interface TransformOptions {
    outputMode?: "runtime" | "compiled" | "auto"
}
```

CLI flags should mirror the API:

```bash
tailwindest-transform src --mode runtime
tailwindest-transform src --mode compiled
tailwindest-transform src --mode auto
```

Default mode should be `auto`, but `auto` must resolve to `runtime` when it
cannot find a strong compiled-mode signal.

## Implementation Plan

1. Add `outputMode` to transformer options and context.
   Verify: unit tests assert the default is `auto` and unknown projects resolve
   to runtime mode.

2. Add a mode resolver that returns both the resolved mode and the evidence used
   for the decision.
   Verify: tests cover explicit options, config files, compiler plugin imports,
   compiler precompile bridge imports, source type imports, package dependency
   only, artifacts only, and unknown projects.

3. Update `TokenAnalyzer` so leaf value selection is mode-aware.
   Verify: analyzer tests cover both runtime and compiled output for simple,
   nested, deeply nested, arbitrary, group-prefixed, and collision cases.

4. Pass the resolved mode through `className`, `cn`/`clsx`, and `cva` walkers.
   Verify: walker tests confirm all supported walkers preserve runtime leaves in
   runtime mode and strip prefixes in compiled mode.

5. Add CLI diagnostics for ambiguous automatic detection.
   Verify: package-dependency-only and artifact-only projects do not silently
   switch to compiled mode.

## Required Test Matrix

Analyzer tests:

- `hover:bg-accent`
- `dark:hover:bg-accent`
- `data-[state=open]:hover:bg-accent`
- group-prefixed variants with a configured group prefix
- property collisions such as `hover:p-4 hover:p-2`

Walker tests:

- `className="dark:hover:bg-red-950"`
- `cn("dark:hover:bg-red-950", dynamicClass)`
- `clsx("dark:hover:bg-red-950")`
- `cva("dark:hover:bg-red-950")`
- `cva(..., { variants: { intent: { primary: "dark:hover:bg-red-950" } } })`

Mode detection tests:

- explicit runtime beats every auto signal
- explicit compiled beats every auto signal
- compiler Vite plugin resolves compiled
- Next precompile bridge resolves compiled
- `CreateCompiledTailwindest` import resolves compiled at file scope
- `@tailwindest/compiler` dependency alone remains runtime with a diagnostic
- unknown projects remain runtime

## Non-Goals

- Do not infer compiled mode from arbitrary naming such as `compiled-entry.ts`
  without a stronger signal.
- Do not rewrite user Tailwindest type definitions.
- Do not change runtime `CreateTailwindest` semantics.
- Do not make package dependency presence a mode-switching condition by itself.

## Approval Criteria

- Runtime users receive the same prefixed leaf values they receive today.
- Compiler users receive raw utility leaf values for every nested variant path.
- Ambiguous automatic detection never silently emits compiled-only output.
- `pnpm --filter css-transformer test` passes.
- Any new mode resolver tests explain the evidence behind the chosen mode.
