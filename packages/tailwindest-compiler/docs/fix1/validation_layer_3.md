# Validation Layer 3: Runtime Preservation and Import Cleanup Safety

## Authority

Validate against `fix_layer_3.md`.

Layer 3 passes only if fallback runtime code remains executable and public
exports are preserved.

## Isolation Requirements

- Run after Layers 1 and 2 pass.
- Work only on import cleanup/runtime preservation and related tests.
- Do not change evaluator semantics or candidate generation.
- Do not add compile coverage.

## Required Evidence

The Judge must inspect:

- import cleanup implementation diff;
- tests for exported `tw` preservation;
- tests for fallback call preservation;
- generated output for exact-only cleanup.

## Acceptance Criteria

- Exact-only local runtime setup can be removed.
- Exported runtime setup is preserved.
- Fallback dynamic calls retain all needed imports and declarations.
- Mixed exact/fallback files remain executable.
- Import cleanup never removes unrelated imports.

## Rejection Criteria

Reject if:

- `export const tw = createTools()` can be removed;
- fallback call remains but `createTools` import is removed;
- cleanup edits introduce syntax errors;
- cleanup relies on local usage only and ignores exports;
- unrelated import formatting churn dominates the diff.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/transform/import_cleanup.test.ts
pnpm --filter @tailwindest/compiler test -- src/vite
pnpm --filter @tailwindest/compiler build
```

If tests are renamed, run the equivalent transform and Vite suites.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- exact output for exported `tw` case;
- exact output for fallback dynamic case;
- import cleanup risk assessment for later layers.
