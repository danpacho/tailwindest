# CSS Transformer Architecture

`@tailwindest/css-transformer` is the migration transformer for Tailwindest. It
converts supported class-string based React source patterns into Tailwindest
object-style calls while preserving runtime behavior. It is not a runtime
dependency and it is not the zero-runtime compiler.

This document defines the production architecture for the current transformer
implementation.

## Reference Targets

- Tailwindest runtime style API: `packages/tailwindest/src/tools/create_tools.ts`
- Runtime authoring type: `CreateTailwindest`
- Deprecated compiler authoring type: `CreateCompiledTailwindest`
- Property resolver source: `create-tailwind-type` `CSSPropertyResolver`
- AST engine: `ts-morph`
- Supported source kinds: `.ts`, `.tsx`, `.js`, `.jsx`

## Production Decision

The transformer is conservative by default. If it cannot prove that a rewrite is
behavior-preserving, it must keep the original source and report diagnostics.

Nested variant output is mode-sensitive:

- `runtime` mode targets `CreateTailwindest` and preserves the original
  prefixed class token at each leaf.
- `compiled` mode is deprecated and reserved for internal compiler experiments.
  It stores raw utility leaf values.
- `auto` mode never selects `compiled`. Deprecated compiler signals produce
  diagnostics and keep runtime output.

## Pipeline

```text
source file
    |
    v
parse with ts-morph
    |
    v
resolve output mode
  - explicit CLI/API mode
  - project config
  - Vite compiler plugin
  - precompile bridge
  - source type imports
  - weak artifact/package diagnostics
    |
    v
collect transform targets
  - cva()
  - cn(), clsx(), classNames()
  - literal JSX className
    |
    v
analyze static class strings
  - split tokens
  - strip variants for resolver lookup
  - resolve utility -> Tailwindest property
  - build nested object tree
  - choose leaf value from output mode
    |
    v
apply replacements in reverse source order
    |
    v
apply import changes once per file
    |
    v
return transformed code, walker results, diagnostics
```

## Public API

The programmatic API accepts a resolver and optional transform configuration:

```ts
interface TransformOptions {
    resolver: CSSPropertyResolver
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: "runtime" | "compiled" | "auto"
    projectRoot?: string
    sourcePath?: string
    walkers?: Array<"cva" | "cn" | "classname">
    config?: CnWalkerConfig & ClassNameWalkerConfig
}
```

The CLI mirrors the output mode option:

```bash
tailwindest-transform src --mode auto
tailwindest-transform src --mode runtime
```

`auto` is the default. Unknown projects resolve to `runtime`.

## Core Components

### Output Mode Resolver

`OutputModeResolver` determines whether object leaf values should preserve the
original token or use the raw utility token.

Deprecated compiler-mode signals:

- explicit `--mode compiled` or API `outputMode: "compiled"`
- Tailwindest config declaring compiler output
- Vite config using `@tailwindest/compiler/vite`
- precompile bridge using `createCompilerContext`
- source importing `CreateCompiledTailwindest`
- `.tailwindest/debug-manifest.json`
- `@tailwindest/compiler` package dependency

Explicit compiled mode is still accepted for internal experiments and emits a
deprecation diagnostic. Auto mode records compiler evidence, emits diagnostics,
and keeps `runtime`.

### Token Analyzer

The analyzer turns class strings into structured records:

```ts
interface TokenAnalyzer {
    analyze(classNames: string | string[]): ParsedToken[]
    buildObjectTree(
        tokens: ParsedToken[],
        options?: { outputMode?: "runtime" | "compiled" }
    ): Record<string, unknown>
}
```

Each parsed token keeps both values:

- `original`: the source token, such as `dark:hover:bg-red-950`
- `utility`: the resolver token, such as `bg-red-950`

`buildObjectTree()` selects the leaf value from `outputMode`.

### Walkers

Walkers own syntax-specific rewrites:

- `CvaWalker`: supported `cva()` base and static variant options
- `CnWalker`: `cn`, `clsx`, and `classNames` static portions
- `ClassNameWalker`: literal JSX `className` attributes

Walkers do not decide nested variant semantics. They pass the resolved context
mode into the analyzer.

### Transformer Registry

The registry collects all matching targets, sorts by walker priority, and
executes replacements from the end of the file toward the beginning. This
prevents earlier replacements from invalidating later source spans.

### Import Collector

Walkers register import requirements and helper imports to remove. The collector
applies import changes once after all source replacements complete.

## Output Mode Semantics

Runtime mode output:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "dark:hover:bg-red-950",
        },
    },
})
```

Compiled mode output:

```ts
tw.style({
    dark: {
        hover: {
            backgroundColor: "bg-red-950",
        },
    },
})
```

The transformer must never globally change runtime behavior to satisfy compiler
typing. Compiler-oriented output requires explicit mode or strong compiler
evidence.

## Supported Transform Surface

Supported:

- static `className="..."`
- `className={"..."}` and no-substitution template literals
- static portions of `cn`, `clsx`, and `classNames`
- dynamic arguments preserved through generated `.class(...)` calls or `tw.join`
- `cva()` base string
- `cva()` static `variants` string options
- import insertion for the configured Tailwindest module

Conservative fallback:

- unknown utilities
- unsupported dynamic class values
- runtime-generated variant maps
- unsafe helper import cleanup
- unsupported `compoundVariants` conversion
- ambiguous output mode evidence

## Safety Model

Production safety is based on five rules:

1. Preserve source when exact static conversion is not proven.
2. Report diagnostics for unresolved or ambiguous inputs.
3. Collect targets before modifying source.
4. Apply replacements in reverse source order.
5. Apply import edits once after all code replacements.

The transformer must not silently drop class tokens.

## Release Criteria

Release is blocked unless the transformer passes:

```bash
pnpm --filter css-transformer test
pnpm --filter css-transformer build
git diff --check -- packages/css-transformer
```

Regression coverage must include:

- runtime and compiled nested variant leaf behavior
- `className`, `cn`/`clsx`/`classNames`, and `cva`
- weak output-mode signal diagnostics
- golden-file fixtures for source output stability
- shadcn registry fixture coverage
