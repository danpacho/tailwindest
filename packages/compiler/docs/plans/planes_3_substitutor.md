# Tailwindest Substitutor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace compileable Tailwindest call sites with static literals or lookup code without damaging surrounding source, source maps, or fallback behavior.

**Architecture:** AST is read-only. The analyzer produces source spans and replacement plans. The substitutor applies them with MagicString in descending offset order and returns code, source map, candidates, diagnostics, and runtime imports to remove.

**Tech Stack:** MagicString, TypeScript source spans, Vitest snapshots, Vite transform return shape.

---

## Files

- Create: `packages/compiler/src/transform/replacement.ts`
- Create: `packages/compiler/src/transform/substitutor.ts`
- Create: `packages/compiler/src/transform/source_map.ts`
- Create: `packages/compiler/src/transform/import_cleanup.ts`
- Test: `packages/compiler/src/transform/__tests__/substitutor.test.ts`
- Test: `packages/compiler/src/transform/__tests__/source_map.test.ts`
- Test: `packages/compiler/src/transform/__tests__/import_cleanup.test.ts`
- Fixture dir: `packages/compiler/src/transform/__fixtures__/`

## Public Contract

```ts
export interface ReplacementPlan {
    span: SourceSpan
    text: string
    priority: number
    kind: TailwindestCallSite["kind"]
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface TransformResult {
    code: string
    map: SourceMapInput | null
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
    changed: boolean
}
```

## Implementation Steps

### Step 1: Write substitution snapshot tests

Required snapshots:

- `tw.style({ display: "flex" }).class()` -> `"flex"`.
- `tw.join("a", ["b", { c: true }])` -> `"a b c"`.
- nested call: `tw.join(tw.style(...).class(), tw.style(...).class())`.
- fallback call remains unchanged with warning diagnostic.
- multiple replacements in one file preserve unrelated code exactly.
- comments outside the replaced span are preserved.

### Step 2: Implement Collect -> Reverse Execute

Rules:

- Sort by `span.start` descending.
- If spans overlap, keep the outer replacement only when it fully contains inner calls and already accounts for their candidates.
- If overlap cannot be proven safe, emit `OVERLAPPING_REPLACEMENT` and do not change the overlapping region.
- Do not call ts-morph `replaceWithText` for final write.
- A thrown error discards all replacements for that file.

### Step 3: Implement source map policy

Policy:

- Source map must map replacement call sites to original call span.
- Token-level style property mapping is not required; debug manifest covers token provenance.
- `sourcesContent` must be preserved when available.
- If source map generation fails, code replacement is allowed only in loose mode with `SOURCE_MAP_FAILED`; strict mode fails the file.

### Step 4: Implement import cleanup

Rules:

- Remove Tailwindest runtime imports only when every local binding from that import is unused after replacement.
- Never remove unrelated imports from the same declaration.
- Do not remove user imports from files with fallback calls.
- Preserve type-only imports unless they become unused and the existing project style removes them.

### Step 5: Add atomic failure tests

Cases:

- invalid replacement span.
- generated replacement text with syntax error.
- source map failure in strict mode.
- import cleanup conflict.

Expected result: original code returned, `changed: false`, diagnostic emitted.

## Completion Criteria

- Snapshot tests prove unchanged formatting outside spans.
- Source map tests prove valid mappings are returned.
- Import cleanup tests prove runtime imports disappear only when safe.
- Atomic failure tests prove no partial replacement is emitted.
