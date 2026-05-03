# Phase 3 Plan: Walker Registry

## Objective

Complete the source transformation layer with a registry, walkers, import
handling, and golden-file tests.

## Deliverables

- `TransformerRegistry`.
- `TransformerContext`.
- `ImportCollector`.
- `CvaWalker`.
- `CnWalker`.
- `ClassNameWalker`.
- Golden-file E2E runner.

## Acceptance Criteria

- Walkers collect targets without mutating source immediately.
- Replacements execute in reverse source order.
- Unsupported patterns preserve original code with diagnostics.
- Import changes are applied once per file.
- Golden fixtures pass.

## Verification

```bash
pnpm --filter @tailwindest/css-transformer test
```
