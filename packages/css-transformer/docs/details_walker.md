# Walker Details

Walkers are syntax-specific transformers registered in `TransformerRegistry`.
Each walker owns one source pattern and delegates class-string semantics to the
shared analyzer.

## Walker Contract

```ts
interface ClassTransformerWalker {
    name: string
    priority: number
    canWalk(node: Node): boolean
    walk(node: Node, context: TransformerContext): TransformResult
}
```

Walkers must be small and deterministic. They should answer three questions:

1. Is this syntax pattern supported?
2. Which static class strings can be safely analyzed?
3. What replacement preserves the unsupported dynamic parts?

## Registry Execution Model

The registry uses Collect -> Reverse Execute:

```text
scan AST
  -> collect matching nodes and their owning walkers
  -> sort by source position descending
  -> call walker.walk(...)
  -> apply imports once
```

Reverse execution prevents source offset corruption when multiple replacements
exist in one file.

## Shared Context

Every walker receives the same `TransformerContext`:

```ts
interface TransformerContext {
    analyzer: TokenAnalyzer
    tailwindestIdentifier: string
    tailwindestModulePath: string
    outputMode: "runtime" | "compiled"
    outputModeEvidence: OutputModeEvidence[]
    imports: ImportCollector
    styles: StyleManager
    diagnostics: Diagnostic[]
}
```

Walkers must pass `context.outputMode` into `buildObjectTree()` so all supported
syntax paths produce the same nested variant semantics.

## Cva Walker

`CvaWalker` supports:

- `cva("...")`
- static base class strings
- static `variants` object values
- preservation of `defaultVariants` and `compoundVariants` metadata as comments
  where exact conversion is not implemented

Example compiled-mode output:

```ts
cva("dark:hover:bg-blue-500", {
    variants: {
        intent: {
            primary: "dark:hover:bg-gray-500",
        },
    },
})
```

becomes a `tw.variants(...)` call with raw nested leaves:

```ts
tw.variants({
    base: {
        dark: {
            hover: {
                backgroundColor: "bg-blue-500",
            },
        },
    },
    variants: {
        intent: {
            primary: {
                dark: {
                    hover: {
                        backgroundColor: "bg-gray-500",
                    },
                },
            },
        },
    },
})
```

## Cn Walker

`CnWalker` supports:

- `cn(...)`
- `clsx(...)`
- `classNames(...)`
- static string literals
- no-substitution template literals
- dynamic arguments preserved in the emitted call

Static and dynamic arguments are separated. Static class strings become a
registered Tailwindest style constant when the object threshold is met. Dynamic
arguments are passed to `.class(...)` or preserved through `tw.join(...)`.

## ClassName Walker

`ClassNameWalker` supports literal JSX attributes:

```tsx
<div className="flex dark:hover:bg-accent" />
<div className={"flex dark:hover:bg-accent"} />
```

It does not rewrite dynamic JSX expressions such as:

```tsx
<div className={isActive ? "flex" : "hidden"} />
```

Those expressions require additional semantic proof and must remain unchanged
until supported explicitly.

## Import Handling

Walkers must not directly edit imports. They register import requirements:

```ts
context.imports.addNamedImport(modulePath, identifier)
context.imports.registerToRemove(helperName)
```

`ImportCollector` applies all import changes once after replacements complete.

## Safety Requirements

- Do not rewrite unsupported dynamic expressions.
- Do not drop unresolved class tokens.
- Do not remove helper imports unless all usages are transformed.
- Do not mutate unrelated source formatting.
- Do not decide runtime vs compiled semantics inside a walker.
- Do not emit invalid TypeScript or JSX.

## Required Tests

Every walker must cover:

- supported syntax detection
- unsupported syntax no-op behavior
- runtime nested variant output
- compiled nested variant output
- mixed static and dynamic arguments
- import insertion
- helper import cleanup when safe
- diagnostics for unresolved tokens
