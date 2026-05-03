# Fix Layer 1: Public Contract

## Purpose

Set the compiler's public objective to a fallback-safe progressive optimizer.

The compiler must not promise public zero-runtime behavior. It must compile only
statically proven exact calls and preserve runtime Tailwindest calls for
everything else.

This layer defines the product and API contract that every later layer must
follow.

## Problem Definition

The earlier architecture exposed a user-selectable compiler policy and
described a zero-runtime path. The implementation could not safely satisfy that
contract:

- normal public patterns could remain runtime under a zero-runtime claim;
- unsafe replacements could still occur under fallback-oriented operation;
- the zero-runtime claim encouraged broad replacement before the compiler had
  provenance and semantic coverage.

The mismatch made release behavior misleading. Users could believe a configured
policy meant full zero-runtime correctness when it did not.

## Fix Strategy

### Engineering Principles

- Simplicity first: one public fallback-safe behavior.
- Surgical change: remove the zero-runtime policy from the public contract
  before changing broad compiler internals.
- Safety over coverage: runtime preservation is valid; behavior-changing
  replacement is not.
- Verifiable success: every unsupported case must preserve source behavior and
  emit inspectable fallback information.

### Interface Strategy

Public compiler options must expose only the fallback-safe compiler contract.

Targets:

- `CompileOptions`
- `TailwindestViteOptions`
- exported public types that expose a compiler policy switch
- README/docs/examples under `packages/tailwindest-compiler`

Required public contract:

```ts
compile(source, options)
```

compiles exact calls when proven and otherwise preserves runtime calls.

Because the compiler is unreleased, the obsolete policy option should be
removed rather than deprecated.

### Algorithm Strategy

1. Remove public policy branching from Vite and programmatic compile paths.
2. Replace policy-driven throw behavior with fallback diagnostics.
3. Normalize all unsupported values to runtime preservation.
4. Remove internal helper names that preserve obsolete policy semantics.
5. Update architecture docs to say "zero-runtime when statically proven".

## Test Targets

### Core Logic Coverage

- `compile()` with unsupported dynamic class returns original source.
- Vite `transformJs()` with unsupported dynamic class returns original source.
- No public type test can import or use a compiler policy mode.
- Existing exact static calls still compile.

### Edge Case Coverage

- Untyped JavaScript cannot enable removed zero-runtime policy behavior.
- Debug manifest still records fallback diagnostics for unsupported calls.
- Programmatic compile and Vite plugin produce the same fallback-safe behavior.

### Error Case Coverage

- Unsupported dynamic style object does not throw.
- Unsupported dynamic variant key does not throw.
- Unproven receiver does not throw; replacement is blocked by later safety
  layers and diagnostics remain visible.

## 100% Completion Goal

This layer is complete only when no public API, public documentation, or public
test fixture presents zero-runtime policy selection as supported user-facing
behavior.

All previous zero-runtime policy expectations must be converted into fallback
expectations or moved to internal-only test helpers.
