# Walker Design

Walkers are focused source transformers registered in the
`TransformerRegistry`. Each walker owns one syntax pattern.

## Walker Contract

```ts
interface Walker {
    name: string
    priority: number
    canWalk(node: Node, context: TransformerContext): boolean
    walk(node: Node, context: TransformerContext): TransformResult
}
```

## Registry Rules

- Higher priority walkers run first during target collection.
- Replacements are applied in reverse source order.
- Overlapping targets are resolved deterministically.
- A failed walker does not abort the whole file.

## Cva Walker

The `CvaWalker` handles supported `cva()` calls:

- base class strings
- static `variants`
- static `defaultVariants` when they can be represented safely

Unsupported `compoundVariants` should be preserved or represented as comments
until exact conversion is implemented.

## Cn Walker

The `CnWalker` handles `cn`, `clsx`, and compatible class helper calls.

Static class strings are converted to Tailwindest style objects. Dynamic
arguments are preserved. If the final expression cannot be represented exactly,
the walker should prefer `tw.def(...)` or preserve the original call with a
diagnostic.

## ClassName Walker

The `ClassNameWalker` converts literal JSX `className` attributes:

```tsx
<button className="inline-flex px-3 py-2" />
```

to a Tailwindest style call when exact conversion is possible.

## Import Handling

Walkers do not directly mutate imports. They report required imports to
`ImportCollector`, which applies import changes once per file.

## Safety Requirements

- Do not rewrite unknown dynamic expressions.
- Do not remove helper imports unless all usages are rewritten.
- Do not reorder unrelated source code.
- Do not emit invalid TypeScript.

## Verification

Each walker needs unit tests and golden-file coverage.
