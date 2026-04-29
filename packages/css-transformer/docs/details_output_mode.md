# Output Mode Detection Details

Output mode controls how nested variant leaves are emitted. It is the most
important compatibility boundary in the CSS transformer because runtime
Tailwindest and compiler Tailwindest intentionally use different authoring
types.

## Modes

```ts
type CssTransformerOutputMode = "runtime" | "compiled" | "auto"
```

Resolved mode is always one of:

```ts
type CssTransformerResolvedOutputMode = "runtime" | "compiled"
```

## Runtime Mode

Runtime mode targets `CreateTailwindest`.

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
})
```

The leaf value remains the original source token because `CreateTailwindest`
expects nested leaf literals to include accumulated variant prefixes.

## Compiled Mode

Compiled mode targets `CreateCompiledTailwindest`.

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
})
```

The leaf value is the raw utility because the compiler/runtime normalizer derives
the semantic prefix from the object path.

## Auto Resolution Priority

`auto` mode is conservative. It switches to compiled mode only when strong
evidence exists.

| Priority | Evidence                                            | Resolved Mode        |
| -------- | --------------------------------------------------- | -------------------- |
| 1        | explicit `runtime` or `compiled` option             | requested mode       |
| 2        | Tailwindest config with compiler output mode        | compiled             |
| 3        | Vite config importing `@tailwindest/compiler/vite`  | compiled             |
| 4        | precompile bridge importing `createCompilerContext` | compiled             |
| 5        | source importing `CreateCompiledTailwindest`        | compiled             |
| 6        | compiler artifact only                              | runtime with warning |
| 7        | `@tailwindest/compiler` dependency only             | runtime with warning |
| 8        | unknown project                                     | runtime              |

## Weak Signal Policy

Weak signals are intentionally not enough to switch modes:

- `.tailwindest/debug-manifest.json`
- `.tailwindest/manifest.json`
- `@tailwindest/compiler` in `dependencies`, `devDependencies`, or
  `peerDependencies`

These may appear in projects that still use the transformer for runtime
Tailwindest migration. Switching to compiled output from weak evidence would
silently generate values that do not satisfy `CreateTailwindest`.

## Diagnostics

Weak signal diagnostics use `OutputModeResolver` as the diagnostic owner:

```ts
{
    level: "warning",
    walkerName: "OutputModeResolver",
    message: "The @tailwindest/compiler dependency is a weak signal only..."
}
```

Diagnostics must explain why runtime mode was retained.

## API Surface

Programmatic transform:

```ts
await transform(source, {
    resolver,
    outputMode: "auto",
    projectRoot: process.cwd(),
    sourcePath: file,
})
```

CLI:

```bash
tailwindest-transform src --mode auto
tailwindest-transform src --mode runtime
tailwindest-transform src --mode compiled
```

## Required Tests

- explicit runtime beats compiled auto signals
- explicit compiled wins
- Vite compiler plugin resolves compiled
- precompile bridge resolves compiled
- `CreateCompiledTailwindest` source import resolves compiled
- compiler artifact only remains runtime with warning
- compiler dependency only remains runtime with warning
- unknown projects remain runtime with no diagnostic
