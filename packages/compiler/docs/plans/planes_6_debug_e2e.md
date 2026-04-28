# Tailwindest Diagnostics and E2E Verification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide strict diagnostics, debug artifacts, and end-to-end proof that dev, debug, and build outputs are identical under the supported Vite adapter.

**Architecture:** Diagnostics are structured data produced by every compiler layer. Debug mode writes a manifest that maps replacements to original source and generated candidates. E2E tests run the full Vite + Tailwind v4 pipeline.

**Tech Stack:** Vitest, Vite dev/build programmatic API, Tailwind CSS v4, source-map validation, Rollup output inspection.

---

## Files

- Create: `packages/compiler/src/debug/diagnostics.ts`
- Create: `packages/compiler/src/debug/debug_manifest.ts`
- Create: `packages/compiler/src/debug/reporting.ts`
- Test: `packages/compiler/src/debug/__tests__/diagnostics.test.ts`
- Test: `packages/compiler/src/debug/__tests__/debug_manifest.test.ts`
- Create fixture app: `packages/compiler/e2e/vite-tailwind-v4/`
- Create e2e test: `packages/compiler/e2e/vite-tailwind-v4/compiler.e2e.test.ts`
- Modify: `packages/compiler/package.json` scripts if needed.

## Diagnostic Contract

Every diagnostic must include:

- `code`
- `severity`: `"error" | "warning" | "info"`
- `modeBehavior`: `"strict-fails" | "loose-fallback" | "informational"`
- `file`
- `span`
- `message`
- optional `suggestion`

Required diagnostic codes:

- `UNSUPPORTED_DYNAMIC_VALUE`
- `UNSUPPORTED_MERGER`
- `UNKNOWN_SPREAD`
- `MUTATED_BINDING`
- `CIRCULAR_STATIC_REFERENCE`
- `OVERLAPPING_REPLACEMENT`
- `SOURCE_MAP_FAILED`
- `VARIANT_TABLE_LIMIT_EXCEEDED`
- `TAILWIND_SOURCE_INJECTION_FAILED`
- `HMR_INVALIDATION_UNCERTAIN`

## Implementation Steps

### Step 1: Write strict/loose diagnostics tests

Cases:

- strict mode fails file transform for unsupported exact compile.
- loose mode preserves original runtime call and emits warning.
- informational diagnostics do not fail either mode.
- multiple diagnostics are stable-sorted by file, line, column, code.

### Step 2: Implement debug manifest

Debug artifact shape:

```ts
export interface TailwindestDebugManifest {
    version: 1
    mode: "strict" | "loose"
    files: Array<{
        id: string
        hash: string
        replacements: Array<{
            kind: string
            originalSpan: SourceSpan
            generatedText: string
            candidates: string[]
            fallback: boolean
        }>
        diagnostics: CompilerDiagnostic[]
    }>
    candidates: string[]
}
```

Rules:

- Only write when `debug: true`.
- Never affect compilation output.
- Stable JSON ordering for snapshot tests.

### Step 3: Build E2E fixture app

Fixture must include:

- `tw.style` static class.
- `tw.join` and `tw.def`.
- `tw.toggle` dynamic boolean.
- `tw.rotary` dynamic key.
- `tw.variants` independent axes and conflicting axes.
- arbitrary values and stacked variants.
- unsupported loose fallback fixture.
- CSS entry using `@import "tailwindcss";`.

### Step 4: Add live-build parity assertions

Assertions:

- dev transform and build transform emit identical manifest candidates.
- final Tailwind CSS contains every manifest candidate.
- production JS bundle has no `PrimitiveStyler`, `ToggleStyler`, `RotaryStyler`, `VariantsStyler` for fully compiled files.
- debug manifest maps every replacement to source file and span.
- deleting a class from source removes it from CSS after rebuild/HMR.

### Step 5: Add final verification scripts

Package scripts should support:

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler test:e2e
```

## Completion Criteria

- Strict/loose behavior is deterministic and snapshot-tested.
- Debug manifest is stable and complete.
- E2E proves Vite live/build Tailwind CSS parity.
- Production output proves zero-runtime for fully compiled files.
