# Validation Layer 5: Diagnostics and Debug Manifest Taxonomy

## Authority

Validate against `fix_layer_5.md`.

Layer 5 passes only if debug artifacts accurately audit compilation outcomes.

## Isolation Requirements

- Run after Layers 1-4 pass.
- Work only on diagnostics/debug manifest status reporting.
- Do not change replacement eligibility or evaluator semantics except to attach
  status/reason data.
- Keep the manifest schema deterministic.

## Required Evidence

The Judge must inspect:

- schema/type changes for debug replacements;
- tests for `compiled`, `runtime-fallback`, `candidate-only`, and
  `unsafe-skipped`;
- serialized debug manifest examples;
- evidence that code output and manifest status agree.

## Acceptance Criteria

- Every exact replacement is marked `compiled`.
- Every preserved runtime Tailwindest call has fallback status and reason.
- Candidate-only patterns are not misreported as compiled.
- Unsafe skipped replacements are visible.
- Debug manifest order is deterministic.

## Rejection Criteria

Reject if:

- manifest says compiled when code was not changed;
- fallback entries lack actionable reasons;
- diagnostics duplicate or contradict each other for the same call;
- schema changes break existing debug tests without replacement coverage;
- debug write failures affect generated code.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/debug
pnpm --filter @tailwindest/compiler test -- src/vite
pnpm --filter @tailwindest/compiler test -- src/transform
```

Run E2E debug manifest checks if this layer changes serialized artifacts used
by fixtures.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- one manifest excerpt for each status;
- code/manifest consistency analysis;
- schema compatibility notes for Layer 6.
