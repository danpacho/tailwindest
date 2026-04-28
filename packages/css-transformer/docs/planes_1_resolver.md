# Phase 1 Plan: Resolver

## Objective

Build a deterministic token resolver that maps supported Tailwind utility
classes to Tailwindest style object paths.

## Deliverables

- Resolver interface.
- Utility family mapping table.
- Diagnostics for unsupported tokens.
- Unit tests for supported and unsupported cases.

## Acceptance Criteria

- Known utility classes resolve to stable paths.
- Unknown tokens return diagnostics.
- Arbitrary values are preserved when the utility family is known.
- No token is silently dropped.

## Verification

```bash
pnpm --filter @tailwindest/css-transformer test
```
