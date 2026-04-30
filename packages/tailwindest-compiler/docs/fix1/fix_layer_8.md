# Fix Layer 8: Regression Test Matrix and Release Gate

## Purpose

Lock the fallback-safe compiler behavior with a regression matrix that prevents
future unsafe compilation.

This layer turns the previous layers into a durable release gate.

## Problem Definition

E2E visual parity can pass while important compiler correctness bugs remain:

- runtime code can remain unintentionally;
- wrong replacement can still produce visually similar output;
- manifest candidates can hide DOM class omissions;
- debug output can misrepresent actual transform behavior.

A release gate must test compiler contracts directly, not only visual outcomes.

## Fix Strategy

### Engineering Principles

- Test the contract, not implementation details alone.
- Every diagnosed bug gets a permanent regression test.
- Core tests cover exact behavior; E2E tests cover integration.
- Keep tests isolated and deterministic.

### Interface Strategy

Create or update test utilities for:

- compile source and inspect transformed code;
- inspect debug manifest records;
- compare generated output with runtime `createTools()`;
- inspect candidate manifest exact/fallback provenance;
- run source-kind variants for `.js`, `.jsx`, `.ts`, `.tsx`.

No production API should exist only for tests unless it is explicitly internal.

### Algorithm Strategy

Build the test matrix around invariants:

1. Unsafe replacement never happens.
2. Runtime fallback stays executable.
3. Replaced output equals runtime.
4. Debug manifest explains each outcome.
5. Candidate manifest is deterministic and provenance-aware.
6. Coverage expansion cannot bypass safety gates.

## Test Targets

### Core Logic Coverage

- `compile()` direct source tests for every fixed bug.
- `compileTailwindestCall()` runtime parity for supported low-level calls.
- analyzer provenance tests for trusted/untrusted receivers.
- transform substitution tests for overlap and fallback preservation.
- import cleanup tests for exports and runtime fallbacks.

### Edge Case Coverage

- JS/JSX/TS/TSX source kinds.
- alias imports and local shadowing.
- mixed static/dynamic variants.
- unsupported merger.
- raw nested variant exclusions.
- HMR update/delete stale candidate behavior.

### Error Case Coverage

- generated syntax failure falls back.
- invalid replacement span falls back.
- debug write failure does not affect codegen.
- unsupported dynamic values preserve runtime.
- unproven receiver records diagnostic and preserves source.

### E2E Coverage

- Vite design-system fixture.
- framework fixtures that rely on CSS source injection.
- debug manifest screenshot/check if schema changes.
- zero-runtime asset checks updated to match the fallback-safe contract.

## 100% Completion Goal

All known diagnostic report bugs must have direct regression tests.

The release gate must fail if:

- fake `tw` is replaced;
- mixed variants lose static props;
- exported `tw` is removed;
- unsupported merger compiles;
- invalid generated JS is emitted;
- debug manifest contradicts transformed code.
