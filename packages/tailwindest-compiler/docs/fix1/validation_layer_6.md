# Validation Layer 6: Candidate Manifest Correctness

## Authority

Validate against `fix_layer_6.md`.

Layer 6 passes only if candidate data is accurate, deterministic, and separated
by provenance where needed.

## Isolation Requirements

- Run after Layers 1-5 pass.
- Work only on candidate manifest, source inline bridge, and debug candidate
  reporting.
- Do not change replacement decisions except to correct candidate provenance.
- Preserve Tailwind CSS bridge behavior unless evidence requires a change.

## Required Evidence

The Judge must inspect:

- candidate provenance implementation;
- manifest update/remove behavior tests;
- raw nested exclusion tests;
- dev/build manifest determinism tests;
- debug manifest candidate provenance examples.

## Acceptance Criteria

- Exact candidates match generated output.
- Fallback-known candidates are labeled and do not imply replacement.
- Raw nested exclusions remain correct.
- Candidate order is deterministic.
- HMR/delete removes stale candidates.

## Rejection Criteria

Reject if:

- generated JS omits an exact candidate marked as exact;
- fallback candidates are indistinguishable in debug output;
- stale candidates survive updates/deletes;
- exclusion logic removes a class still needed as a top-level candidate;
- CSS injection order is nondeterministic.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/tailwind
pnpm --filter @tailwindest/compiler test -- src/vite
pnpm --filter @tailwindest/compiler test -- src/debug
```

Run relevant E2E CSS contract tests if source inline output changes.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- exact vs fallback-known candidate examples;
- raw nested exclusion evidence;
- stale candidate removal evidence;
- remaining coverage risks for Layer 7.
