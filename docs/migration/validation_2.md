# Validation 2: Replacement Surface Reduction

## Authority

Validate against `docs/migration/phase_2.md`.

## Judge Packet

```text
[JUDGE PACKET]
Problem:
Object-returning and general static-evaluation replacements must be removed
without breaking nested variant class lowering.

Audit target:
api_compile replacement generation, compile_transform debug status, core/Vite
tests, and release matrix expectations changed for Phase 2.

Audit criteria:
1. Forbidden APIs cannot produce replacement plans.
2. Final class-output nested lowering still produces exact class strings.
3. Forbidden APIs can still contribute candidates when statically known.
4. Debug manifest status is not "compiled" for forbidden APIs.
5. Chained object reuse no longer creates a mismatch between manifest candidates
   and runtime output.
6. Changes are surgical and do not rewrite evaluator internals unnecessarily.

Required evidence:
- Direct tests for every forbidden API family.
- Test for object-returning nested shorthand reuse.
- Test showing `tw.style({ dark: { ... } }).class()` still compiles.
- Command output for core and Vite test suites.
- Compiler build output.

Rejection rule:
Reject if any runtime-visible object call is still replaced, if class-output
nested lowering regresses, or if broad refactors obscure the behavioral change.

Output format:
PASS or FAIL plus a numbered defect list.
```

## Required Checks

Run:

```bash
pnpm --filter @tailwindest/compiler test src/core src/vite
pnpm --filter @tailwindest/compiler build
```

## Acceptance Criteria

- `tw.join("px-4")` remains source code, not a string literal replacement.
- `tw.mergeRecord(...)` remains source code.
- `*.style(...)` and `*.compose(...)` remain source code.
- `style.class`, `mergeProps`, `def`, and supported `*.class(...)` cases still
  lower nested raw leaves when exact.
- Candidate-only calls do not disappear from manifest records.

## Rejection Criteria

- Any forbidden kind has `replacement` populated.
- Debug manifest reports a forbidden kind as `compiled`.
- Tests only check generated candidates and do not check transformed code.
- The implementation deletes or rewrites unrelated evaluator behavior.
