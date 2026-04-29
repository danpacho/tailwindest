# CSS Transformer Production Discussion

This document records the major engineering decisions behind
`@tailwindest/css-transformer`.

## Migration Tool vs Compiler

`@tailwindest/css-transformer` rewrites source code to Tailwindest authoring
patterns. It does not remove Tailwindest runtime calls from application bundles.

`@tailwindest/compiler` performs build-time evaluation and zero-runtime
replacement. The transformer may generate compiler-oriented source when asked,
but it is not responsible for Tailwind CSS candidate manifests, `@source
inline()`, HMR, or bundle substitution.

Decision:

- Keep css-transformer focused on migration.
- Keep zero-runtime behavior in `@tailwindest/compiler`.

## Runtime vs Compiled Nested Variants

Runtime Tailwindest and compiled Tailwindest use different type contracts:

- `CreateTailwindest` expects nested leaf values with accumulated prefixes.
- `CreateCompiledTailwindest` expects raw nested leaf values.

The transformer therefore cannot use a single leaf policy. It must choose based
on output mode.

Decision:

- Runtime mode uses `token.original`.
- Compiled mode uses `token.utility`.
- Auto mode defaults to runtime unless strong compiler evidence exists.

## Why Package Dependency Is Not Enough

A project may install `@tailwindest/compiler` while still using the transformer
to migrate runtime Tailwindest source. If dependency presence switched the
transformer to compiled output, generated code could fail `CreateTailwindest`
type checks or change authoring semantics.

Decision:

- `@tailwindest/compiler` dependency is a weak signal.
- Weak signals produce diagnostics and keep runtime mode.

## Why Source Type Imports Are Strong Enough

If a source file imports `CreateCompiledTailwindest`, the file is explicitly
authoring against compiler-oriented Tailwindest types. In that context, nested
leaf values must be raw utilities.

Decision:

- `CreateCompiledTailwindest` import resolves compiled mode for that transform
  context when no explicit mode overrides it.

## Why Walkers Do Not Own Mode Semantics

`className`, `cn`, `clsx`, `classNames`, and `cva` all process class strings.
If each walker chose leaf semantics independently, parity would drift.

Decision:

- Output mode lives in `TransformerContext`.
- Walkers pass `context.outputMode` into the analyzer.
- The analyzer is the only component that chooses `original` vs `utility`
  leaves.

## Why Collect -> Reverse Execute

AST nodes can become stale after source replacement. Large files may contain
many supported patterns, and replacing from the top of the file can shift spans
for later targets.

Decision:

- Collect all targets first.
- Execute replacements in reverse source order.
- Apply import edits after code replacements.

This keeps replacements deterministic without requiring a full source printer.

## Why Unsupported Dynamic Expressions Are Preserved

The transformer cannot prove runtime values such as conditional expressions,
template strings with substitutions, or computed variant maps without deeper
semantic analysis. Rewriting them incorrectly is worse than leaving migration
work for the user.

Decision:

- Preserve unsupported dynamic expressions.
- Emit diagnostics where possible.
- Add support only with focused tests for exact behavior.

## Release Risk Areas

- Resolver drift from Tailwind CSS or generated type data.
- Incorrect auto mode detection.
- Nested variant prefix duplication or prefix loss.
- Import cleanup removing helpers still used elsewhere.
- Source placement bugs for generated constants.
- Golden fixture updates that hide behavior changes.

These risks are covered by resolver/analyzer/walker tests, golden fixtures,
shadcn registry fixtures, build verification, and `git diff --check`.
