# Fix Layer 6: Candidate Manifest Correctness

## Purpose

Align Tailwind CSS candidate generation with actual compiled and fallback
outcomes.

The CSS bridge may include best-effort candidates for runtime fallback, but it
must make exact vs fallback candidate provenance clear.

## Problem Definition

The compiler can currently collect candidates that do not match generated class
output. The mixed variants bug is one example: CSS candidates may include a
class that the DOM output omits.

Candidate correctness has two dimensions:

- exact compiled output candidates;
- statically knowable fallback candidates.

They should not be treated as the same evidence.

## Fix Strategy

### Engineering Principles

- Candidate exactness must track code exactness.
- Best-effort fallback candidates are useful but must be labeled.
- Exclusions must be computed from effective semantic candidates, not raw
  leaves alone.
- Keep Tailwind bridge deterministic.

### Interface Strategy

Introduce candidate provenance internally:

```ts
type CandidateKind = "exact" | "fallback-known"

interface CandidateRecord {
    candidate: string
    kind: CandidateKind
    sourceSpan?: SourceSpan
}
```

The public manifest may continue exposing sorted strings for Tailwind injection,
but debug manifest should expose candidate provenance when possible.

`FileCandidateRecord` can remain string-based for Tailwind CSS, but the compiler
context should retain enough metadata for validation and debug reporting.

### Algorithm Strategy

1. For compiled calls, derive exact candidates from generated class output or
   exact style records.
2. For preserved runtime fallback calls, collect only statically knowable
   candidates and mark them `fallback-known`.
3. Do not let fallback-known candidates prove generated code correctness.
4. Compute raw nested exclusions only against effective included candidates.
5. Keep final `@source inline()` deterministic and sorted.
6. Ensure removal/update of a file clears both exact and fallback candidates.

## Test Targets

### Core Logic Coverage

- Exact static call candidates are marked exact.
- Runtime fallback static portions are marked fallback-known.
- Mixed variants compiled output candidates match generated output.
- Tailwind CSS injection contains all required exact candidates.

### Edge Case Coverage

- Raw nested shorthand leaves are excluded only when not also included.
- Candidate ordering is deterministic across dev and build contexts.
- Deleted files remove exact and fallback candidates.
- HMR updates do not retain stale candidates.

### Error Case Coverage

- Unsupported dynamic full class values do not fabricate unknown candidates.
- Fallback-known candidates do not suppress diagnostics.
- Candidate manifest remains valid if debug manifest write fails.

## 100% Completion Goal

Every candidate in the manifest must be explainable as either exact compiled
output or statically knowable fallback support.

No test may rely on manifest candidates as proof that generated JS contains the
same class string unless candidate kind is exact.
