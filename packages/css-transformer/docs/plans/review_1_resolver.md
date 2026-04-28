# Phase 1 Review: Resolver

## Decision

Approved when the resolver is deterministic, table-driven, and covered by unit
tests.

## Blocking Issues

- Silent token drops.
- Ambiguous mappings without diagnostics.
- Arbitrary value corruption.

## Required Verification

```bash
pnpm --filter @tailwindest/css-transformer test
```
