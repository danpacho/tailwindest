# Phase 1: Contract And Provenance Safety

## Purpose

Narrow the compiler's public contract before changing broad replacement logic.
The compiler is no longer a general Tailwindest partial evaluator. Its release
objective is nested variant lowering plus Tailwind CSS candidate manifest
bridging.

This phase also fixes receiver provenance matching so non-Tailwindest modules
cannot be compiled by substring accident.

## Problem Definition

The current implementation and docs still describe broad static evaluation.
That framing encourages replacements for runtime-visible intermediate values,
which is the source of compilation/result drift. Separately, module provenance
currently accepts any module specifier containing `tailwindest/`, including
unrelated packages such as `not-tailwindest/foo`.

## Robust Code Strategy

- Minimal change: update public contract docs and strict module matching only.
- In scope:
    - `packages/tailwindest-compiler/docs/ARCHITECTURE.md`
    - `packages/tailwindest-compiler/README.md`
    - `packages/tailwindest-compiler/src/analyzer/detector.ts`
    - `packages/tailwindest-compiler/src/vite/compile_transform.ts`
    - focused analyzer/Vite tests covering module provenance
- Out of scope:
    - replacement allowlist changes
    - candidate manifest algorithm changes
    - e2e fixture rewrites
    - broad API compile refactors
- Feature verification:
    - `tailwindest` and sanctioned `tailwindest/...` imports still compile when
      otherwise eligible.
- Edge verification:
    - `not-tailwindest/foo`, `@scope/not-tailwindest/foo`, and arbitrary packages
      containing the substring `tailwindest/` do not compile.
- Error verification:
    - unproven receivers remain runtime source with diagnostics or no replacement.

## Implementation Plan

1. Add provenance regression tests first.
    - Prefer `packages/tailwindest-compiler/src/analyzer/__tests__/detector.test.ts`
      for analyzer-level proof.
    - Add one transform-level regression in
      `packages/tailwindest-compiler/src/vite/__tests__/vite_plugin.test.ts` or
      `release_gate_matrix.test.ts` proving `not-tailwindest/foo` is not changed.

2. Replace loose module checks.
    - Replace `moduleSpecifier.includes("tailwindest/")` with a strict matcher:
      `moduleSpecifier === "tailwindest" || moduleSpecifier.startsWith("tailwindest/")`.
    - Apply the same helper semantics in both analyzer and transform merger
      detection paths.

3. Update public contract docs.
    - `ARCHITECTURE.md` must say the compiler's objective is nested variant
      lowering and manifest bridging.
    - Remove or downgrade language that presents static class optimization or
      zero-runtime output as the core value.
    - Keep fallback-safe language, but clarify that runtime-visible object
      replacement is outside the release contract.

4. Run focused verification.
    - `pnpm --filter @tailwindest/compiler test -- src/analyzer src/vite`
    - `pnpm --filter @tailwindest/compiler build`

## Implementer Packet

```text
[IMPLEMENTER PACKET]
Problem:
The compiler contract is too broad and module provenance accepts unrelated
module specifiers containing "tailwindest/".

Current situation:
Architecture docs describe broad static evaluation. Analyzer and transform
helpers use loose substring matching for Tailwindest module detection.

Goal:
Establish the reduced public contract and make Tailwindest module provenance
strict without changing replacement behavior yet.

Exact implementation method:
1. Add failing provenance tests for non-Tailwindest module specifiers.
2. Change module matching to exact package or package subpath only.
3. Update compiler architecture/README wording to nested variant lowering plus
   manifest bridge.
4. Keep all unrelated compiler behavior unchanged.

In-scope files or modules:
packages/tailwindest-compiler/docs/ARCHITECTURE.md
packages/tailwindest-compiler/README.md
packages/tailwindest-compiler/src/analyzer/detector.ts
packages/tailwindest-compiler/src/vite/compile_transform.ts
packages/tailwindest-compiler/src/analyzer/__tests__/detector.test.ts
packages/tailwindest-compiler/src/vite/__tests__/vite_plugin.test.ts
packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts

Out-of-scope changes:
Do not change API compile replacement policy, candidate generation, source
inline injection, e2e fixtures, or runtime package code.

Verification to satisfy:
pnpm --filter @tailwindest/compiler test -- src/analyzer src/vite
pnpm --filter @tailwindest/compiler build

Completion signal:
Return changed files, exact tests run, and evidence that non-Tailwindest module
imports are preserved.
```

## Completion Criteria

- Contract docs no longer present broad static evaluation as the release goal.
- Strict module matcher prevents substring false positives.
- Existing eligible Tailwindest imports are still recognized.
- Focused tests and compiler build pass.
