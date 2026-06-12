# CSS Transformer Architecture

`tailwindest-css-transform` migrates supported Tailwind class-string source
patterns into Tailwindest runtime object-style calls. It is not a runtime
dependency.

## Reference Targets

- Tailwindest runtime style API: `packages/tailwindest/src/tools/create_tools.ts`
- Runtime authoring type: `CreateTailwindest`
- Property resolver source: `create-tailwind-type` `CSSPropertyResolver`
- AST engine: `ts-morph`
- Supported source kinds: `.ts`, `.tsx`, `.js`, `.jsx`

## Production Decision

The transformer emits runtime-compatible Tailwindest objects only. Nested
variant leaf values preserve the original Tailwind class token, including
variant prefixes.

## Pipeline

```text
source file
    |
    v
parse with ts-morph
    |
    v
resolve output mode
  - auto -> runtime
  - runtime -> runtime
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
  - strip variants only for resolver lookup
  - resolve utility -> Tailwindest property
  - classify unresolved tokens as preserved metadata
  - build nested object tree
  - keep original token at each leaf
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

```ts
interface TransformOptions {
    resolver: CSSPropertyResolver
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    outputMode?: "runtime" | "auto"
    projectRoot?: string
    sourcePath?: string
    walkers?: Array<"cva" | "cn" | "classname">
    config?: CnWalkerConfig & ClassNameWalkerConfig
}
```

Programmatic `transform()` callers provide their own resolver and retain the
same defaults as before. CLI-only discovery lives outside the transformer core.

## CLI Resolution

Normal CLI use requires only a target path:

```bash
tailwindest-transform src/components
```

If no target is provided, the interactive prompt asks only for that target path.
Afterward the CLI resolves:

- Tailwind CSS entry with `findTailwindCSSRoot(process.cwd())`, unless
  `--css` is provided.
- Tailwind package base with `resolveTailwindNodeDir(cssPath)`,
  `getTailwindVersion`, and `isVersionSufficient`; older local Tailwind
  versions warn and fall back to the internal v4 engine.
- Tailwindest identifier from an exported `createTools(...)` constant in common
  `tailwind.ts` or `tw.ts` locations, then project TypeScript files.
- Tailwindest import path from `tsconfig.json` or `jsconfig.json` aliases when
  possible, otherwise a relative module path.
- Output mode `auto`, walkers `cva`, `cn`, and `classname`, and dry-run `false`.

Explicit CLI flags override discovery:

```bash
tailwindest-transform src \
    --css src/styles/tailwind.css \
    --identifier tw \
    --module @/styles/tailwind \
    --mode runtime \
    --dry-run
```

## Safety Model

If the transformer cannot prove that a rewrite is behavior-preserving, it keeps
the original source, uses a raw `tw.join(...)` fallback, or reports diagnostics.
Resolver failure for a supported static source is not deletion; it is preserved
metadata.

## Lossless Class Source Plan

Each supported static source is represented as a `ClassSourcePlan`:

```ts
type ClassSourcePlan = {
    source: string
    tokens: ClassSourceToken[]
    structuredTokens: StructuredClassToken[]
    preservedTokens: PreservedClassToken[]
    styleTree: Record<string, any>
}
```

Structured tokens are resolver-backed and can be emitted in Tailwindest style
objects. Preserved tokens are unresolved or non-property class tokens and remain
ordinary JavaScript string literals in generated class-producing expressions.

## Serialization Contract

The transformer serializes a static source by shape:

| Source shape                       | Output                                      |
| ---------------------------------- | ------------------------------------------- |
| all structured and above threshold | `styleConst.class()`                        |
| structured + preserved             | `tw.def(["preserved"], styleConst.style())` |
| below threshold                    | `tw.join("original source")`                |
| no structured tokens               | `tw.join("original source")`                |

For `cn`, `clsx`, and `classNames`, static-after-dynamic arguments are kept in
argument order with `tw.join(...)`; the walker must not pool later static
arguments before earlier dynamic ones.

For CVA, preserved base tokens are unconditional. Preserved variant-option
tokens are conditional on the selected option and emitted through
`tw.def([...], variants.style(...))` at call sites.

## Registry Gate

The shadcn registry gate has three layers:

1. `shadcn_class_stability.test.ts` proves each supported input source is
   stable under `tailwind-merge`.
2. `shadcn_class_preservation.test.ts` proves transformed output contains every
   supported static input token as a multiset.
3. `shadcn_registry.test.ts` locks the final generated snapshots.
