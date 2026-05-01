# Phase 2: Replacement Surface Reduction

## Purpose

Remove the broad partial-evaluation surface. The compiler should replace code
only when the returned value is a final class string that needs nested variant
lowering. Runtime-visible style objects and styler objects must not be emitted
as static JavaScript values.

## Problem Definition

Current object-returning replacements can produce objects that are not
runtime-equivalent once they are passed back into Tailwindest runtime APIs.
Examples include `tw.style(...).style()`, `tw.mergeRecord(...)`, and
`*.compose(...)`. These replacements create manifest candidates for lowered
classes while leaving runtime-observed objects in pre-lowered shape.

## Robust Code Strategy

- Minimal change: gate replacements, do not redesign evaluator internals.
- In scope:
    - `packages/tailwindest-compiler/src/core/api_compile.ts`
    - `packages/tailwindest-compiler/src/vite/compile_transform.ts`
    - `packages/tailwindest-compiler/src/core/__tests__/api_compile.test.ts`
    - `packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts`
    - `packages/tailwindest-compiler/src/vite/__tests__/vite_plugin.test.ts`
- Out of scope:
    - changing runtime `createTools`
    - changing Tailwind CSS source inline injection
    - adding build-time merger execution
    - full e2e fixture redesign
- Feature verification:
    - `tw.style(staticNested).class()` still compiles to the lowered class string.
    - `tw.mergeProps(staticNested)` and `tw.def(staticClassList, staticNested)`
      may compile only when they directly return the final class string and all
      inputs are static.
- Edge verification:
    - `tw.style(...).style()`, `*.style()`, `*.compose()`, `tw.mergeRecord(...)`,
      and `tw.join(...)` do not produce replacement plans.
- Error verification:
    - object-returning nested shorthand emits an explicit diagnostic instead of a
      misleading exact replacement.

## Replacement Policy

Allowed replacement classes:

- `style.class`
- `mergeProps`
- `def`
- `toggle.class`
- `rotary.class`
- `variants.class`

Only replace these when the call needs nested compiled variant lowering or is
part of a directly lowered nested variant class path.

Forbidden replacement classes:

- `style.style`
- `toggle.style`
- `rotary.style`
- `variants.style`
- `style.compose`
- `toggle.compose`
- `rotary.compose`
- `variants.compose`
- `mergeRecord`
- `join`

Forbidden calls can still contribute candidates and diagnostics.

## Implementation Plan

1. Add tests proving forbidden calls are not replaced.
    - Include base cases without nested shorthand.
    - Include nested shorthand object-returning cases.
    - Include chained reuse:
      `const rec = tw.style({ dark: { color: "text-white" } }).style(); tw.style(rec).class()`

2. Introduce a narrow replacement gate.
    - Keep evaluator helpers if tests still use them, but do not attach
      `replacement` to forbidden API compile results.
    - Prefer a small helper such as `isClassOutputReplacementKind(kind)`.
    - Do not delete large evaluator code in this phase unless it becomes unused
      by TypeScript.

3. Preserve candidates separately from replacements.
    - Forbidden calls should return candidate information when statically known.
    - They must not be reported as `compiled` in debug manifest.
    - Use `candidate-only` or an explicit diagnostic status as appropriate.

4. Normalize tests to the new contract.
    - Rewrite release matrix expectations that currently require zero-runtime
      output for `join`, `mergeRecord`, `*.style`, or `*.compose`.
    - Keep exact class-output tests for nested variant lowering.

5. Run focused verification.
    - `pnpm --filter @tailwindest/compiler test src/core src/vite`
    - `pnpm --filter @tailwindest/compiler build`

## Implementer Packet

```text
[IMPLEMENTER PACKET]
Problem:
The compiler currently replaces runtime-visible object and styler-producing
calls, causing compiled manifest candidates and runtime class output to drift.

Current situation:
api_compile.ts can emit exact replacements for style.style, style.compose,
toggle.style, rotary.style, variants.style, variants.compose, mergeRecord, and
join. Some of these values can be reused by runtime Tailwindest calls.

Goal:
Restrict code replacement to final class-string outputs required for nested
variant lowering, while retaining safe candidate collection.

Exact implementation method:
1. Add tests for forbidden replacement kinds and chained object reuse.
2. Add a small replacement allowlist for class-output APIs.
3. Make forbidden APIs candidate-only or diagnostic-only, never compiled.
4. Update release matrix expectations to the reduced contract.

In-scope files or modules:
packages/tailwindest-compiler/src/core/api_compile.ts
packages/tailwindest-compiler/src/vite/compile_transform.ts
packages/tailwindest-compiler/src/core/__tests__/api_compile.test.ts
packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts
packages/tailwindest-compiler/src/vite/__tests__/vite_plugin.test.ts

Out-of-scope changes:
Do not refactor evaluator architecture, source inline injection, Vite plugin
ordering, Tailwind runtime packages, or e2e fixtures unless a focused unit test
cannot pass without a small expectation update.

Verification to satisfy:
pnpm --filter @tailwindest/compiler test src/core src/vite
pnpm --filter @tailwindest/compiler build

Completion signal:
Return changed files, forbidden-kind test evidence, and proof that nested
style.class still lowers to prefixed classes.
```

## Completion Criteria

- Forbidden APIs never produce replacement plans.
- Debug manifest does not mark forbidden APIs as compiled.
- Class-output nested lowering still works.
- Focused tests and compiler build pass.
