# CSS Transformer Testing Strategy

The CSS transformer is a migration tool. A valid-looking rewrite can still be a
behavioral regression, so release readiness depends on strict tests for both
successful conversion and conservative fallback.

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

## Split Utility Tests

These tests prove that class strings and variant prefixes are parsed without
corrupting arbitrary values or arbitrary variants.

Required cases:

- whitespace splitting
- stacked variants
- arbitrary values with brackets
- arbitrary variants with brackets
- empty strings

## Output Mode Resolver Tests

These tests protect the runtime/compiled compatibility boundary.

Required cases:

- explicit runtime
- explicit compiled
- Vite compiler plugin detection
- precompile bridge detection
- `CreateCompiledTailwindest` import detection
- artifact-only warning
- package-dependency-only warning
- unknown project defaults

## Analyzer Tests

Analyzer tests must verify record semantics independent of source rewriting.

Required cases:

- simple utility classes
- runtime nested variant leaves
- compiled nested variant leaves
- deeply nested variants
- group-prefixed variants
- duplicate property array promotion
- unresolved token warnings
- mixed supported and unsupported tokens

## Walker Tests

Each walker must prove both syntax behavior and output mode propagation.

Required cases:

- `className="..."`
- `className={"..."}`
- `cn(...)`
- `clsx(...)`
- `classNames(...)`
- `cva("...")`
- `cva(..., { variants: ... })`
- runtime nested leaves
- compiled nested leaves
- dynamic argument preservation
- unsupported dynamic no-op behavior

## Golden-File E2E

Golden fixtures contain:

```text
fixtures/<case>/input.tsx
fixtures/<case>/expected.tsx
```

The runner transforms `input.tsx` and compares exact output with
`expected.tsx`. Golden files protect import placement, constant placement,
format stability, and multi-pattern interactions.

## shadcn Registry Fixtures

The shadcn registry suite is a broad migration corpus. It is allowed to produce
resolver warnings for unsupported custom utilities, but transformed output must
remain stable against checked fixtures.

This suite is not a replacement for focused unit tests. It is a regression net
for real-world component patterns.

## Build Verification

Production readiness requires declaration generation, not only unit tests:

```bash
pnpm --filter css-transformer build
```

This catches public API type errors, Node type configuration problems, and
`exactOptionalPropertyTypes` regressions.

## Release Gate

Run before release:

```bash
pnpm --filter css-transformer test
pnpm --filter css-transformer build
git diff --check -- packages/css-transformer
```

Release is blocked by any failure.

## Regression Rule

Every bug fix must include a test that fails before the fix and passes after the
fix. For nested variant behavior, tests must cover all supported walker paths:

- analyzer
- `ClassNameWalker`
- `CnWalker`
- `CvaWalker`
