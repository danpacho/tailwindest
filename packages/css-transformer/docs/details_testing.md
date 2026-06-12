# CSS Transformer Testing Strategy

The CSS transformer is a migration tool. Release readiness depends on strict
tests for successful conversion and conservative fallback.

## Test Layers

1. Split utility tests
2. Output mode resolver tests
3. Analyzer tests
4. Walker tests
5. Import collector tests
6. Transformer registry tests
7. Placement tests
8. Golden-file E2E tests
9. shadcn registry fixture tests
10. shadcn class stability tests
11. shadcn class preservation tests
12. Runtime contract parity tests
13. Build and declaration generation

## Output Mode Resolver Tests

Required cases:

- explicit runtime
- auto defaults to runtime
- unsupported mode rejection

## Analyzer Tests

Required cases:

- simple utility classes
- runtime nested variant leaves
- deeply nested variants
- group-prefixed variants
- duplicate property array promotion
- unresolved token warnings
- lossless `plan()` preservation metadata
- mixed supported and unsupported tokens

## Walker Tests

Required cases:

- `className="..."`
- `className={"..."}`
- `cn(...)`
- `clsx(...)`
- `classNames(...)`
- `cva("...")`
- `cva(..., { variants: ... })`
- runtime nested leaves
- dynamic argument preservation
- preserved raw token serialization through `tw.def(...)`
- all-unresolved raw fallback through `tw.join(...)`
- static-after-dynamic argument order
- CVA preserved base token call-site rewrite
- CVA preserved variant token conditional rewrite
- unsupported dynamic no-op behavior

## Registry Preservation Tests

The shadcn registry tests are not snapshot-only. The final gate includes:

- `shadcn_class_stability.test.ts`: collects supported static class sources
  from every registry input and checks `twMerge(tokens.join(" "))` is stable.
- `shadcn_class_preservation.test.ts`: transforms every registry input and
  verifies the output class-producing expressions contain every supported input
  token as a multiset.
- `shadcn_registry.test.ts`: compares transformed output to the checked-in
  final snapshots.

The preservation spec explicitly guards historical omission families:

- `group/name`
- `peer/name`
- `@container/name`
- `[--var:value]`
- `variant:[--var:value]`
- `data-[side=...]:slide-in-*`
- `**:` descendant chains
- `xs:w-(--var)`

## Release Gate

Run before release:

```bash
pnpm --filter tailwindest-css-transform test
pnpm --filter tailwindest-css-transform build
pnpm --filter tailwindest test src/tools/__tests__/merger_interface.test.ts
pnpm --filter tailwindest-core test src/__tests__/runtime_parity.test.ts
git diff --check -- packages/css-transformer
```
