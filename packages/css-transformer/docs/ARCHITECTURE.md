# CSS Transformer Architecture

`@tailwindest/css-transformer` migrates supported Tailwind class-string source
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

The CLI mirrors the output mode option:

```bash
tailwindest-transform src --mode auto
tailwindest-transform src --mode runtime
```

`auto` is the default and resolves to runtime output.

## Safety Model

If the transformer cannot prove that a rewrite is behavior-preserving, it keeps
the original source and reports diagnostics.
