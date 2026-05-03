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

Walkers must answer three questions:

1. Is this syntax pattern supported?
2. Which static class strings can be safely analyzed?
3. What replacement preserves unsupported dynamic parts?

## Shared Context

Every walker receives the same `TransformerContext`:

```ts
interface TransformerContext {
    analyzer: TokenAnalyzer
    tailwindestIdentifier: string
    tailwindestModulePath: string
    imports: ImportCollector
    styles: StyleManager
    diagnostics: Diagnostic[]
}
```

## Supported Walkers

`CvaWalker` supports static `cva("...")` base classes and static `variants`
object values.

`CnWalker` supports `cn(...)`, `clsx(...)`, and `classNames(...)` with static
string literals and dynamic arguments preserved.

`ClassNameWalker` supports literal JSX attributes:

```tsx
<div className="flex dark:hover:bg-accent" />
<div className={"flex dark:hover:bg-accent"} />
```

## Import Handling

Walkers must not directly edit imports. They register import requirements and
`ImportCollector` applies all import changes once after replacements complete.

## Safety Requirements

- Do not rewrite unsupported dynamic expressions.
- Do not drop unresolved class tokens.
- Do not remove helper imports unless all usages are transformed.
- Do not mutate unrelated source formatting.
- Do not emit invalid TypeScript or JSX.

## Required Tests

- supported syntax detection
- unsupported syntax no-op behavior
- runtime nested variant output
- mixed static and dynamic arguments
- import insertion
- helper import cleanup when safe
- diagnostics for unresolved tokens
