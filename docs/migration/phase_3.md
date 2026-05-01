# Phase 3: Nested Candidate Lowering And Error Semantics

## Purpose

Make nested compiled shorthand safe when replacement is impossible. The compiler
must never silently preserve a runtime call while injecting CSS candidates that
assume a different prefixed class string.

This phase also removes sentinel collision risk in dynamic variant class tables.

## Problem Definition

Nested shorthand is a compiler-only authoring form. Runtime Tailwindest treats
object keys structurally. If a nested shorthand call cannot be lowered to a
final class string, preserving the runtime call can produce raw classes while
the manifest contains prefixed classes.

Dynamic variant tables also use `"__missing"` as a sentinel value, which can
collide with a real user variant value.

## Robust Code Strategy

- Minimal change: classify unsafe nested fallback explicitly, and fix sentinel
  encoding without changing public APIs.
- In scope:
    - `packages/tailwindest-compiler/src/core/api_compile.ts`
    - `packages/tailwindest-compiler/src/core/variant_optimizer.ts`
    - `packages/tailwindest-compiler/src/core/diagnostic_types.ts`
    - `packages/tailwindest-compiler/src/debug/diagnostics.ts`
    - `packages/tailwindest-compiler/src/vite/compile_transform.ts`
    - focused core/Vite/debug tests
- Out of scope:
    - implementing build-time mergers
    - compiling object-returning APIs
    - adding a new public policy switch
- Feature verification:
    - unsupported nested shorthand returns a diagnostic that identifies the call
      as compile-required or runtime-unsafe, not as a normal safe fallback.
- Edge verification:
    - real variant values named `"__missing"` work in dynamic `variants.class`.
    - unknown dynamic variant values still behave like runtime missing values.
- Error verification:
    - table overflow for nested shorthand class output does not silently produce
      mismatched CSS/runtime behavior.

## Diagnostic Policy

Introduce or reuse a diagnostic code with a clear meaning:

```text
COMPILED_VARIANT_REQUIRES_CLASS_OUTPUT
```

Meaning:

- Nested compiled shorthand was detected.
- The call cannot be safely lowered to a final class string.
- Runtime fallback would not be semantically equivalent.

Programmatic `compile()` should return the original code plus this diagnostic.
The Vite path should surface it in debug diagnostics and release tests. If the
current plugin does not fail builds on diagnostics, do not add a broad failure
system in this phase; document the residual risk for Phase 4 integration.

## Implementation Plan

1. Add regression tests for unsafe nested fallback.
    - Object-returning nested shorthand remains source but emits the new
      diagnostic.
    - Dynamic class-output overflow with nested shorthand emits the diagnostic
      or a more specific overflow diagnostic that is not treated as exact.

2. Fix sentinel encoding.
    - Avoid using a user-reachable string sentinel for generated table keys.
    - Acceptable minimal approaches:
        - encode missing state as a generated token that cannot be produced by
          `String(value)`, or
        - build table keys with tagged states such as `m:<axis>` and `v:<value>`.
    - Preserve existing runtime behavior for false, 0, undefined, and unknown
      values.

3. Keep dynamic `variants.style()` out of replacement.
    - The Phase 2 forbidden policy should already block it.
    - Add explicit regression coverage for the parent/child path collision case
      so it cannot return as an optimization later.

4. Verify debug behavior.
    - Debug manifest should show runtime-unsafe or candidate-only status, not
      compiled, for unsafe nested fallbacks.

5. Run focused verification.
    - `pnpm --filter @tailwindest/compiler test src/core src/debug src/vite`
    - `pnpm --filter @tailwindest/compiler build`

## Implementer Packet

```text
[IMPLEMENTER PACKET]
Problem:
Nested compiled shorthand cannot safely fall back to runtime when replacement is
impossible, and dynamic variant lookup tables collide with a real "__missing"
variant key.

Current situation:
Fallback diagnostics treat many unsupported cases as safe runtime fallbacks.
Dynamic variants use a string sentinel that can be a valid user key.

Goal:
Make unsafe nested fallback explicit and remove sentinel collision while keeping
the reduced replacement surface from Phase 2.

Exact implementation method:
1. Add tests for compile-required nested shorthand diagnostics.
2. Add tests for "__missing" as a real variant value.
3. Change dynamic variant key encoding so missing state cannot collide with
   user values.
4. Ensure dynamic variants.style parent/child collision remains non-replaced.
5. Keep code changes localized to diagnostics and table key generation.

In-scope files or modules:
packages/tailwindest-compiler/src/core/api_compile.ts
packages/tailwindest-compiler/src/core/variant_optimizer.ts
packages/tailwindest-compiler/src/core/diagnostic_types.ts
packages/tailwindest-compiler/src/debug/diagnostics.ts
packages/tailwindest-compiler/src/vite/compile_transform.ts
packages/tailwindest-compiler/src/core/__tests__/api_compile.test.ts
packages/tailwindest-compiler/src/debug/__tests__/diagnostics.test.ts
packages/tailwindest-compiler/src/vite/__tests__/vite_plugin.test.ts

Out-of-scope changes:
Do not re-enable object-returning replacements, do not add a public policy
switch, and do not implement semantic tailwind-merge evaluation.

Verification to satisfy:
pnpm --filter @tailwindest/compiler test src/core src/debug src/vite
pnpm --filter @tailwindest/compiler build

Completion signal:
Return changed files, diagnostic evidence, sentinel collision test evidence,
and proof that forbidden replacement kinds remain non-replaced.
```

## Completion Criteria

- Unsafe nested fallback is visible through a specific diagnostic.
- `"__missing"` can be a real variant value.
- Unknown or absent dynamic variant values still match runtime behavior.
- Dynamic `variants.style()` path collision is covered and not replaced.
- Focused tests and compiler build pass.
