# Validation 3: Nested Candidate Lowering And Error Semantics

## Authority

Validate against `docs/migration/phase_3.md`.

## Judge Packet

```text
[JUDGE PACKET]
Problem:
Nested shorthand must not silently fall back to runtime with mismatched
manifest candidates, and dynamic variant missing-state encoding must not collide
with user keys.

Audit target:
Diagnostics, dynamic variant key encoding, core/debug/Vite tests, and any
candidate/debug manifest behavior changed for Phase 3.

Audit criteria:
1. Unsafe nested shorthand fallback has a specific diagnostic.
2. The diagnostic is surfaced in programmatic compile and Vite debug paths.
3. Real "__missing" variant values are selected correctly.
4. Unknown, undefined, false, and 0 dynamic values preserve runtime behavior.
5. Dynamic variants.style remains non-replaced, including parent/child path
   collision cases.
6. Phase 2 forbidden replacement guarantees still hold.

Required evidence:
- Unit tests for unsafe nested fallback diagnostics.
- Unit tests for "__missing" real variant values.
- Unit tests for false, 0, undefined, and unknown dynamic variant values.
- Debug/Vite test showing diagnostic visibility.
- Command output for required test suites and build.

Rejection rule:
Reject if unsafe nested fallback is indistinguishable from safe runtime
fallback, if "__missing" remains reserved by accident, or if object-returning
replacement returns.

Output format:
PASS or FAIL plus a numbered defect list.
```

## Required Checks

Run:

```bash
pnpm --filter @tailwindest/compiler test src/core src/debug src/vite
pnpm --filter @tailwindest/compiler build
```

## Acceptance Criteria

- `COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT` or equivalent code exists and is
  tested.
- Programmatic `compile()` preserves code and returns the diagnostic for unsafe
  nested object-returning calls.
- Dynamic `variants.class` handles `"__missing"` as a real configured value.
- Dynamic missing behavior for absent values remains runtime-compatible.
- No forbidden replacement kind is reintroduced.

## Rejection Criteria

- The implementation only changes tests without changing diagnostic semantics.
- Sentinel collision is patched by banning `"__missing"` user keys.
- Dynamic `variants.style()` is compiled again.
- Diagnostics are swallowed before reaching debug manifest or compile result.
