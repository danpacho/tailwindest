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
object values. Structured CVA definitions remain `tw.style(...)` or
`tw.variants(...)`. If base or option strings contain preserved tokens,
rewritten call sites use `tw.def([...], helper.style(...))`.

`CnWalker` supports `cn(...)`, `clsx(...)`, and `classNames(...)` with static
string literals and dynamic arguments preserved. Static arguments before a
dynamic argument may be serialized together; static arguments after a dynamic
argument must stay after that dynamic argument in generated `tw.join(...)`.

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
- Use analyzer `plan(...)` for supported static class sources.
- Emit preserved static tokens through `tw.def(...)` or raw `tw.join(...)`.
- Do not emit `String.raw` for transformer-generated preserved tokens.
- Do not remove helper imports unless all usages are transformed.
- Do not mutate unrelated source formatting.
- Do not emit invalid TypeScript or JSX.

## Preserved Token Serialization

For plain `className` and join-like calls:

```tsx
className={tw.def(["group/card"], cardStyle.style())}
tw.join(tw.def(["peer/menu-button"], menuButton.style()), className)
```

For CVA call sites:

```tsx
tw.join(
    tw.def(
        [
            "peer/menu-button",
            size === "lg" && "group-data-[collapsible=icon]:!p-0",
        ],
        buttonVariants.style({ size })
    ),
    className
)
```

Variant-specific preserved CVA tokens must never be emitted unconditionally. If
a selected option cannot be expressed safely, the walker emits a diagnostic.

## Required Tests

- supported syntax detection
- unsupported syntax no-op behavior
- runtime nested variant output
- mixed static and dynamic arguments
- mixed structured and preserved static tokens
- static-after-dynamic argument order
- CVA base preserved tokens
- CVA variant-option preserved tokens
- unsafe CVA selected-option diagnostics
- import insertion
- helper import cleanup when safe
- diagnostics for unresolved tokens
