# Tailwindest Manifest Bridge and Vite Adapter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide Vite 8 dev/build orchestration and Tailwind v4 candidate delivery through `@source inline()` with live-build parity.

**Architecture:** `tailwindest()` returns two pre plugins: `tailwindest:transform` for JS/TS files and `tailwindest:source` for CSS files. A shared `CompilerContext` owns cache, pre-scan, candidate manifest, dependency graph, diagnostics, and HMR invalidation.

**Tech Stack:** Vite 8 plugin API, Tailwind CSS v4 `@tailwindcss/vite`, Vitest, fixture Vite app, path normalization.

---

## Files

- Create: `packages/compiler/src/tailwind/manifest.ts`
- Create: `packages/compiler/src/tailwind/source_inline.ts`
- Create: `packages/compiler/src/vite/index.ts`
- Create: `packages/compiler/src/vite/context.ts`
- Create: `packages/compiler/src/vite/cache.ts`
- Create: `packages/compiler/src/vite/hmr.ts`
- Modify: `packages/compiler/src/index.ts`
- Test: `packages/compiler/src/tailwind/__tests__/manifest.test.ts`
- Test: `packages/compiler/src/tailwind/__tests__/source_inline.test.ts`
- Test: `packages/compiler/src/vite/__tests__/vite_plugin.test.ts`
- E2E fixture: `packages/compiler/e2e/vite-tailwind-v4/`

## Public Contract

```ts
export interface CandidateManifest {
    version: 1
    byFile: Map<string, FileCandidateRecord>
    all: Set<string>
    revision: number
}

export interface FileCandidateRecord {
    id: string
    hash: string
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}

export interface TailwindestViteOptions {
    include?: Array<string | RegExp>
    exclude?: Array<string | RegExp>
    mode?: "strict" | "loose"
    debug?: boolean
    variantTableLimit?: number
    cssEntries?: Array<string | RegExp>
    merger?: MergerPolicy
}
```

## Implementation Steps

### Step 1: Write manifest tests

Required cases:

- add/update/remove candidates by file.
- duplicate candidates collapse globally.
- deleting one file does not delete candidates still used by another file.
- `revision` changes only when effective manifest content changes.
- path keys are normalized.

### Step 2: Write `@source inline()` injection tests

Required cases:

- inject after `@import "tailwindcss";`.
- do not duplicate injection on repeated transforms.
- remove previous Tailwindest injection before inserting updated manifest.
- preserve user CSS outside the injected block.
- escape quotes, brackets, arbitrary values, slash opacity, and stacked variants.
- compress simple variant families with brace expansion only when safe.

Expected marker:

```css
/* tailwindest:start */
@source inline("...");
/* tailwindest:end */
```

### Step 3: Implement Vite plugin shape

Rules:

- `tailwindest()` returns `[transformPlugin, sourcePlugin]`.
- Both plugins use `enforce: "pre"`.
- User config must place `tailwindest()` before `tailwindcss()`.
- Use Vite `transform.filter` where available and internal include/exclude fallback.
- `buildStart` and dev startup must pre-scan source roots to avoid empty initial CSS manifests.

### Step 4: Implement HMR invalidation

Rules:

- A changed style definition invalidates every dependent JS module.
- A manifest revision change invalidates every configured CSS entry module.
- Candidate deletion must trigger CSS regeneration.
- If dependency graph is uncertain, prefer invalidating more modules over stale output.

### Step 5: Implement live-build parity tests

Test matrix:

- dev transform result equals build transform result for the same fixture.
- CSS transformed by `tailwindest:source` contains the same candidates in dev and build.
- `@tailwindcss/vite` output includes manifest candidates.
- style edit updates JS output and CSS output without stale classes.

## Completion Criteria

- `pnpm --filter @tailwindest/compiler test -- src/tailwind src/vite` passes.
- E2E Vite fixture proves generated CSS includes every manifest candidate.
- HMR test proves changed and deleted class candidates update live CSS.
- No implementation relies on Tailwind scanning transformed JS.
