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
10. Build and declaration generation

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
- unsupported dynamic no-op behavior

## Release Gate

Run before release:

```bash
pnpm --filter css-transformer test
pnpm --filter css-transformer build
git diff --check -- packages/css-transformer
```
