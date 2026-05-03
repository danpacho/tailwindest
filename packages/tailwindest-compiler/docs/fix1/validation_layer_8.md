# Validation Layer 8: Regression Test Matrix and Release Gate

## Authority

Validate against `fix_layer_8.md`.

Layer 8 passes only if the full fallback-safe compiler contract is covered by
automated tests and release commands.

## Isolation Requirements

- Run after Layers 1-7 pass.
- Work only on tests, fixtures, and release-gate documentation unless a test
  exposes an unfixed prior-layer bug.
- Any production fix discovered here must be sent back to the relevant layer.
- Do not weaken assertions to make E2E pass.

## Required Evidence

The Judge must collect:

- mapping from every diagnostic bug to at least one regression test;
- command output for unit, integration, E2E, build, and dry pack where relevant;
- updated zero-runtime expectations aligned with the fallback-safe contract;
- debug/candidate manifest evidence from fixtures.

## Acceptance Criteria

- Every diagnosed bug has a direct regression test.
- Test matrix covers core logic, edge cases, and error cases.
- E2E still validates dev/build/debug convergence under fallback-safe semantics.
- Release commands pass.
- Test assertions would fail on the original diagnosed bugs.

## Rejection Criteria

Reject if:

- tests only assert snapshots without behavioral checks;
- E2E passes while unit coverage for a diagnosed bug is missing;
- zero-runtime checks still assume removed policy behavior;
- failing tests are skipped instead of fixed;
- production changes are mixed into this layer without assigning them back to
  their proper fix layer.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler pack:dry
```

If full E2E is too expensive during iteration, the Judge may accept targeted
evidence temporarily, but final Layer 8 cannot pass without full commands.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- bug-to-test traceability table;
- full command evidence;
- remaining accepted limitations, if any;
- final release-readiness decision for fix1.
