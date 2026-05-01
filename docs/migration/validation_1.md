# Validation 1: Contract And Provenance Safety

## Authority

Validate against `docs/migration/phase_1.md`.

## Judge Packet

```text
[JUDGE PACKET]
Problem:
The compiler must first narrow its public contract and prevent false-positive
Tailwindest provenance before replacement behavior is reduced.

Audit target:
Docs, analyzer provenance matching, transform provenance matching, and focused
tests changed for Phase 1.

Audit criteria:
1. Public docs describe nested variant lowering plus manifest bridging as the
   release objective.
2. Docs do not promise broad static optimization as the primary contract.
3. Module matching accepts only "tailwindest" and "tailwindest/*".
4. Non-Tailwindest module names containing "tailwindest/" are not compiled.
5. Existing Tailwindest imports still work.
6. No replacement policy or candidate algorithm changes were introduced.

Required evidence:
- Relevant docs diff.
- Exact matcher implementation diff.
- Test output for focused analyzer/Vite tests.
- Compiler build output.
- `git status --short` before final judgment.

Rejection rule:
Reject if false-positive provenance remains possible, docs still frame the
compiler as a general partial evaluator, or unrelated internals were refactored.

Output format:
PASS or FAIL plus a numbered defect list.
```

## Required Checks

Run:

```bash
pnpm --filter @tailwindest/compiler test -- src/analyzer src/vite
pnpm --filter @tailwindest/compiler build
```

## Acceptance Criteria

- `not-tailwindest/foo` and scoped equivalents preserve original source.
- `tailwindest` and `tailwindest/...` import paths remain eligible.
- Contract language is internally consistent across README and architecture.
- No broad replacement surface changes appear in the diff.

## Rejection Criteria

- Any substring matcher remains for module provenance.
- Docs still state or imply that the compiler's essence is general static
  evaluation.
- Tests were weakened instead of adding direct false-positive coverage.
- Build or focused tests fail.
