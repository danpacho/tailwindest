# Phase 2 Plan: Analyzer

## Objective

Convert resolved class token streams into Tailwindest style records while
preserving variant semantics and override order.

## Deliverables

- Analyzer API.
- Variant prefix nesting.
- Merge and override rules.
- Analyzer diagnostics.
- Unit tests.

## Acceptance Criteria

- Static class strings become deterministic object records.
- Stacked variants become nested objects.
- Duplicate properties follow source order.
- Unresolved tokens are reported.

## Verification

```bash
pnpm --filter @tailwindest/css-transformer test
```
