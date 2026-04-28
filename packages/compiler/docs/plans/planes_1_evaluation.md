# Tailwindest Evaluation Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the pure deterministic engine that reproduces `createTools()` runtime semantics without AST, file-system, or Vite dependencies.

**Architecture:** The evaluator accepts already-resolved static values and returns class strings, style records, generated candidates, and diagnostics. It must match `packages/tailwindest/src/tools/*` behavior before any optimization is allowed. Merger behavior is explicit through `MergerPolicy`.

**Tech Stack:** TypeScript, Vitest, `clsx` parity fixtures, runtime parity fixtures from `packages/tailwindest/src/tools/__tests__`.

---

## Files

- Create: `packages/compiler/src/core/evaluator.ts`
- Create: `packages/compiler/src/core/static_value.ts`
- Create: `packages/compiler/src/core/merger.ts`
- Create: `packages/compiler/src/core/diagnostic_types.ts`
- Test: `packages/compiler/src/core/__tests__/evaluator.test.ts`
- Test: `packages/compiler/src/core/__tests__/merger.test.ts`
- Test fixture source: `packages/tailwindest/src/tools/__tests__/create_tools.test.ts`
- Test fixture source: `packages/tailwindest/src/tools/__tests__/compose.test.ts`
- Test fixture source: `packages/tailwindest/src/tools/__tests__/styler.test.ts`

## Public Contract

```ts
export type MergerPolicy =
    | { kind: "none" }
    | { kind: "known"; name: "tailwind-merge"; configHash: string }
    | {
          kind: "custom"
          evaluateAtBuildTime: true
          moduleId: string
          exportName: string
      }
    | { kind: "unsupported"; reason: string }

export interface EvaluationResult<T> {
    value: T
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface EvaluationEngine {
    flattenRecord(style: StaticStyleObject | null | undefined): string[]
    getClassName(style: StaticStyleObject | null | undefined): string
    deepMerge(styles: StaticStyleObject[]): StaticStyleObject
    join(
        values: StaticClassValue[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    def(
        classList: StaticClassValue[],
        styles: StaticStyleObject[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    mergeProps(
        styles: StaticStyleObject[],
        merger: MergerPolicy
    ): EvaluationResult<string>
    mergeRecord(
        styles: StaticStyleObject[]
    ): EvaluationResult<StaticStyleObject>
}
```

## Implementation Steps

### Step 1: Write runtime parity tests first

Add tests that compare compiler evaluator output to the current runtime behavior for:

- `Styler.flattenRecord(undefined)`, `{}`, nested objects, arrays.
- `Styler.deepMerge` last-win behavior for strings, arrays, nested objects, mixed array/non-array.
- `Styler.getClassName` order preservation.
- `tw.join` with strings, nested arrays, object dictionaries, falsey values, numbers, bigint.
- `tw.def` with class list plus multiple style records.
- `tw.mergeRecord` and `tw.mergeProps`.

Run:

```bash
pnpm --filter @tailwindest/compiler test -- src/core/__tests__/evaluator.test.ts
```

Expected before implementation: failures for missing evaluator exports.

### Step 2: Implement minimal pure evaluator

Implementation rules:

- No `ts-morph`, `typescript`, `vite`, `fs`, `path`, or process environment access.
- Preserve object insertion order exactly as runtime does.
- Do not sort Tailwind class tokens.
- Return candidates as every non-empty token produced by style/class evaluation.
- Empty style returns empty string and empty candidate list.

### Step 3: Implement explicit merger handling

Rules:

- `kind: "none"` uses runtime default: split additional class tokens by spaces and join with a single space.
- `kind: "known"` is only exact if the known merger is implemented or supplied by a build-time adapter with stable config hash.
- `kind: "unsupported"` returns a diagnostic and must not claim exact compilation.

Required diagnostics:

- `UNSUPPORTED_MERGER`
- `NON_DETERMINISTIC_MERGER`
- `MERGER_CONFIG_MISSING`

### Step 4: Add complex-edge tests

Tests must include:

- Duplicate property override across three style records.
- Nested object override mixed with arrays.
- Arbitrary value strings such as `bg-[#123456]`, `w-[calc(100%-1rem)]`, `bg-(--my-color)`.
- Stacked variants as plain tokens, for example `dark:hover:sm:bg-red-500`.
- Current runtime bug compatibility checks where relevant. If runtime is wrong, document and create a failing compatibility decision test rather than silently changing semantics.

## Completion Criteria

- `pnpm --filter @tailwindest/compiler test -- src/core/__tests__/evaluator.test.ts` passes.
- `pnpm --filter @tailwindest/compiler test -- src/core/__tests__/merger.test.ts` passes.
- Every runtime test copied from `packages/tailwindest/src/tools/__tests__` either passes or has an explicit compatibility decision.
- No compiler infrastructure dependency exists in `src/core/evaluator.ts`.
