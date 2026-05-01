# Validation 4: Integration Release Gate

## Authority

Validate against `docs/migration/phase_4.md`.

## Judge Packet

```text
[JUDGE PACKET]
Problem:
The reduced compiler contract must be integrated across release matrix, e2e
fixtures, docs, package build, and root TypeScript checks.

Audit target:
Release matrix updates, e2e fixture changes, public docs, package test/build
results, root typecheck result, and any documented e2e residual risk.

Audit criteria:
1. No integration test expects broad static replacement for runtime-preserved
   APIs.
2. Nested variant class-output behavior remains covered in integration tests.
3. Unsafe nested object-returning usage is absent or asserted as diagnostic
   behavior.
4. README and ARCHITECTURE describe the same contract implemented by tests.
5. Package tests pass.
6. Package build passes.
7. Root TypeScript check passes.
8. E2E status is either pass or explicitly documented with a concrete blocker.

Required evidence:
- Release matrix diff.
- E2E fixture diff, if any.
- Docs diff.
- Output of package test, package build, and root typecheck.
- Output or blocker note for framework e2e commands.
- `git status --short` before final judgment.

Rejection rule:
Reject if docs/tests still assert the old broad partial-evaluator contract, if
typecheck fails, or if e2e failures are ignored rather than documented.

Output format:
PASS or FAIL plus a numbered defect list.
```

## Required Checks

Minimum:

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
pnpm ts:typecheck
```

Recommended where practical:

```bash
pnpm --filter @tailwindest/compiler e2e:vite-tailwind-v4
pnpm --filter @tailwindest/compiler e2e:design-system-vite
```

## Acceptance Criteria

- All minimum commands pass.
- Any skipped e2e command has a concrete environment or time blocker.
- Integration tests enforce nested variant lowering, not zero-runtime for all
  Tailwindest APIs.
- Public docs do not contradict the reduced compiler behavior.

## Rejection Criteria

- `pnpm ts:typecheck` fails.
- Package test or build fails.
- Old zero-runtime/broad static optimization assertions remain.
- Unsafe nested shorthand can silently drift in integration fixtures.
