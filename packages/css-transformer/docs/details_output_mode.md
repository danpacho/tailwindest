# Output Mode Detection Details

Output mode controls how nested variant leaves are emitted. It is the most
important compatibility boundary in the CSS transformer because runtime
Tailwindest and compiler Tailwindest intentionally use different authoring
types.

Compiler-oriented output is now deprecated and internal-only. Auto mode must
not select it.

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

Compiled mode is deprecated and targets the internal
`CreateCompiledTailwindest` experiment.

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

`auto` mode is conservative. It records compiler evidence, emits diagnostics,
and keeps runtime output.

| Priority | Evidence                                            | Resolved Mode         |
| -------- | --------------------------------------------------- | --------------------- |
| 1        | explicit `runtime` option                           | runtime               |
| 2        | explicit `compiled` option                          | compiled with warning |
| 3        | Tailwindest config with compiler output mode        | runtime with warning  |
| 4        | Vite config importing `@tailwindest/compiler/vite`  | runtime with warning  |
| 5        | precompile bridge importing `createCompilerContext` | runtime with warning  |
| 6        | source importing `CreateCompiledTailwindest`        | runtime with warning  |
| 7        | compiler artifact only                              | runtime with warning  |
| 8        | `@tailwindest/compiler` dependency only             | runtime with warning  |
| 9        | unknown project                                     | runtime               |

## Deprecated Signal Policy

Compiler signals are intentionally not enough to switch modes:

- `.tailwindest/debug-manifest.json`
- `.tailwindest/manifest.json`
- `@tailwindest/compiler` in `dependencies`, `devDependencies`, or
  `peerDependencies`
- Tailwindest compiler config
- compiler Vite plugin
- precompile bridge
- `CreateCompiledTailwindest` source import

These may appear in projects that still use the transformer for runtime
Tailwindest migration. Switching to compiled output from evidence would silently
generate values that do not satisfy `CreateTailwindest`.

## Diagnostics

Deprecated compiler diagnostics use `OutputModeResolver` as the diagnostic
owner:

```ts
{
    level: "warning",
    walkerName: "OutputModeResolver",
    message: "Detected deprecated compiler-mode signal..."
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
```

## Required Tests

- explicit runtime beats compiled auto signals
- explicit compiled emits a deprecation diagnostic
- Vite compiler plugin remains runtime with warning
- precompile bridge remains runtime with warning
- `CreateCompiledTailwindest` source import remains runtime with warning
- compiler artifact only remains runtime with warning
- compiler dependency only remains runtime with warning
- unknown projects remain runtime with no diagnostic
