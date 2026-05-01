# Phase 4: Integration Release Gate

## Purpose

Complete the migration by aligning integration tests, e2e expectations, docs,
and TypeScript checks with the reduced compiler contract.

## Problem Definition

After Phases 1-3, unit behavior should be correct, but release confidence
depends on the framework fixtures and public docs no longer expecting broad
static evaluation or zero-runtime bundles. The release gate must prove dev,
debug, and build use the same nested variant lowering contract.

## Robust Code Strategy

- Minimal change: update integration expectations to the new contract; do not
  redesign fixture UI.
- In scope:
    - `packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts`
    - `packages/tailwindest-compiler/e2e/**`
    - `packages/tailwindest-compiler/docs/ARCHITECTURE.md`
    - `packages/tailwindest-compiler/README.md`
    - package-level and root TypeScript/build checks
- Out of scope:
    - visual redesign of examples
    - runtime package feature changes
    - unrelated docs site migration work
- Feature verification:
    - framework fixtures still render nested variant class-output behavior.
- Edge verification:
    - bundle assertions no longer require removal of all Tailwindest runtime
      helpers unless the page only uses compile-supported class-output APIs.
- Error verification:
    - unsafe nested object-returning usage is either removed from fixtures or
      asserted as diagnostic behavior, not silently accepted.

## Implementation Plan

1. Rebaseline release matrix.
    - Remove expectations that `tw.join`, `mergeRecord`, `*.style`, or
      `*.compose` disappear from transformed code.
    - Keep assertions for nested variant class-output correctness.
    - Keep negative provenance and unsafe fallback assertions.

2. Rebaseline e2e fixtures.
    - Identify fixture code that depended on zero-runtime broad replacement.
    - Keep runtime calls where they are normal Tailwindest runtime behavior.
    - For nested shorthand, prefer terminal class-output usage in fixture UI.
    - Avoid using raw nested shorthand in object-returning channels unless the
      fixture is explicitly testing diagnostics.

3. Update public docs.
    - README supported surface should describe:
        - nested variant class-output lowering;
        - candidate manifest bridge;
        - runtime fallback for normal Tailwindest APIs;
        - compile-required diagnostics for unsafe nested shorthand.
    - Architecture should remove stale dynamic style/object lookup claims.

4. Run final integration checks.
    - `pnpm --filter @tailwindest/compiler test`
    - `pnpm --filter @tailwindest/compiler build`
    - `pnpm ts:typecheck`
    - If practical in the current environment:
        - `pnpm --filter @tailwindest/compiler e2e:vite-tailwind-v4`
        - `pnpm --filter @tailwindest/compiler e2e:design-system-vite`

5. Record residual risk.
    - If full framework e2e cannot run, document the exact command not run and
      why.
    - Do not claim migration complete without typecheck and at least package
      test/build evidence.

## Implementer Packet

```text
[IMPLEMENTER PACKET]
Problem:
Integration tests and public docs still reflect the old broad static
optimization contract after the core compiler has been narrowed.

Current situation:
Release matrix and e2e fixtures may assert zero-runtime or static replacement
for APIs that are now intentionally runtime-preserved.

Goal:
Align integration expectations and public documentation with nested variant
lowering plus manifest bridging, then prove package and TypeScript checks pass.

Exact implementation method:
1. Update release matrix expectations to the reduced contract.
2. Update e2e fixtures only where they use raw nested shorthand in unsafe
   object-returning channels or assert zero-runtime for runtime APIs.
3. Update README/ARCHITECTURE supported-surface sections.
4. Run package tests, package build, root typecheck, and practical e2e commands.

In-scope files or modules:
packages/tailwindest-compiler/src/vite/__tests__/release_gate_matrix.test.ts
packages/tailwindest-compiler/e2e/**
packages/tailwindest-compiler/docs/ARCHITECTURE.md
packages/tailwindest-compiler/README.md
package.json only if scripts already referenced by validation need correction

Out-of-scope changes:
Do not reintroduce broad static evaluation to satisfy old tests. Do not change
runtime Tailwindest APIs. Do not redesign fixture pages.

Verification to satisfy:
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
pnpm ts:typecheck
Run practical compiler e2e commands or document why they could not run.

Completion signal:
Return changed files, all command outputs, e2e status, and a residual risk
summary.
```

## Completion Criteria

- Release matrix matches the reduced contract.
- Public docs are consistent with implementation.
- Package tests pass.
- Package build passes.
- Root TypeScript check passes.
- E2E commands pass or blocked commands are explicitly documented.
