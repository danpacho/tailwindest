# Validation Layer 7: Safe Compile Coverage Expansion

## Authority

Validate against `fix_layer_7.md`.

Layer 7 passes only if new compile coverage is exact and all unsupported forms
remain preserved runtime fallback.

## Isolation Requirements

- Run after Layers 1-6 pass.
- Implement one syntax family at a time.
- Do not weaken safety gates to gain coverage.
- Do not remove fallback diagnostics for unsupported patterns.

## Required Evidence

The Judge must inspect:

- list of newly supported patterns;
- runtime parity tests for each pattern;
- fallback tests for adjacent unsupported patterns;
- debug manifest status tests;
- candidate correctness tests for newly compiled patterns.

## Acceptance Criteria

- Every newly compiled pattern matches runtime for bounded states.
- Unsupported related patterns preserve runtime.
- Provenance safety gate remains active.
- Merger fallback rules remain active.
- Candidate/debug records are correct for new coverage.

## Rejection Criteria

Reject if:

- coverage expansion compiles through name trust instead of provenance;
- any mutable or dynamic pattern is partially compiled;
- runtime parity tests cover only the happy path;
- fallback status disappears from debug manifest;
- implementation refactors broad compiler architecture without need.

## Validation Commands

Minimum:

```bash
pnpm --filter @tailwindest/compiler test -- src/analyzer
pnpm --filter @tailwindest/compiler test -- src/core
pnpm --filter @tailwindest/compiler test -- src/vite
pnpm --filter @tailwindest/compiler test -- src/transform
```

Run design-system E2E if the fixture relies on newly compiled patterns.

## Final Judgment Format

The Judge report must include:

- verdict: pass or fail;
- supported pattern matrix;
- unsupported fallback matrix;
- runtime parity evidence;
- explicit confirmation that Layers 2-6 still hold.
