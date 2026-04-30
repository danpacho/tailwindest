# Tailwindest Core Engine Extraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
>
> **Correction:** The runtime/compiler normalizer boundary in this original
> extraction plan was too broad. `@tailwindest/core` must not own
> compiler-oriented nested variant prefix generation. See
> [2026-04-30-runtime-compiler-normalizer-boundary.md](./2026-04-30-runtime-compiler-normalizer-boundary.md)
> for the authoritative corrective plan.

**Goal:** Extract the shared Tailwindest semantic engine into a new core package so `tailwindest` runtime and `@tailwindest/compiler` produce identical results without duplicated evaluator logic.

**Architecture:** Create a new `@tailwindest/core` package by extracting the current `tailwindest` runtime semantics as the source of truth: class-list normalization, style flattening, deep merge, styler models, and deterministic candidate extraction helpers. Keep public `createTools()` wrappers in `tailwindest`, and keep analyzer/provenance/codegen/diagnostics/manifest logic in `@tailwindest/compiler`.

**Tech Stack:** TypeScript, pnpm workspaces, tsup, vitest, clsx.

---

## Extraction Boundary

### Source Of Truth

The current `tailwindest` runtime implementation is authoritative. The core
package must be extracted from runtime behavior first, then the compiler must
be rewired to consume that extracted behavior. If compiler behavior and runtime
behavior differ, the compiler must change unless a runtime bug is explicitly
identified, fixed in `tailwindest`, and covered by runtime tests first.

Practical consequences:

- `packages/tailwindest/src/tools/create_tools.ts` defines the public semantic
  contract for `join`, `def`, `style`, `toggle`, `rotary`, `variants`,
  `mergeProps`, and `mergeRecord`.
- `packages/tailwindest/src/tools/styler.ts`,
  `primitive.ts`, `toggle.ts`, `rotary.ts`, `variants.ts`, `to_class.ts`, and
  `to_def.ts` define the runtime behavior to preserve.
- Compiler files such as `packages/tailwindest-compiler/src/core/evaluator.ts`
  and `styler_model.ts` are compatibility targets, not semantic authorities.
- Extraction must not “improve” runtime semantics while moving code. Any
  semantic correction must be a separate runtime-first change with before/after
  tests.

### Move To `@tailwindest/core`

The core package owns behavior that must be identical at runtime and compile time.

Files/functions to extract:

- From `packages/tailwindest/src/tools/style_normalizer.ts`
    - `flattenStyleRecord`
    - structural leaf-string flattening only
- From `packages/tailwindest/src/tools/styler.ts`
    - `deepMerge`
    - `flattenRecord`
    - `getClassName`
    - default class-token merge used by `Styler.merge`
- From `packages/tailwindest/src/tools/to_class.ts`
    - `ClassList`
    - `toClass`
    - clsx-compatible class-list semantics
- From `packages/tailwindest/src/tools/to_def.ts`
    - `toDef`
- From the current `tailwindest` runtime behavior, with compiler
  `styler_model.ts` used only as a compile-time compatibility map:
    - `PrimitiveStyleModel`, `ToggleStyleModel`, `RotaryStyleModel`, `VariantsStyleModel`
    - `createPrimitiveModel`, `createToggleModel`, `createRotaryModel`, `createVariantsModel`
    - `primitiveClass`, `primitiveStyle`, `composePrimitive`
    - `toggleClassFor`, `toggleStyleFor`, `composeToggle`
    - `rotaryClassFor`, `rotaryStyleFor`, `composeRotary`
    - `variantsClassFor`, `variantsStyleFor`, `composeVariants`
    - `classCandidatesFromStyles`, `classCandidatesFromStrings`
    - `allToggleStyles`, `allRotaryStyles`, `allVariantStyles`
    - `mergeClassNames`
- From the current `tailwindest` runtime behavior, with compiler
  `evaluator.ts` used only as an adapter target:
    - `createEvaluationEngine`
    - `EvaluationEngine`
    - `join`
    - `def`
    - `mergeProps`
    - `mergeRecord`

### Keep In `tailwindest`

The runtime package remains the public API and type facade.

Keep or rewrite as wrappers:

- `packages/tailwindest/src/tools/create_tools.ts`
    - public generic `createTools<Type>()`
    - public type-level shaping for `CreateTailwindest`, `CreateCompiledTailwindest`, and literal options
- `packages/tailwindest/src/tools/styler.ts`
    - public `Styler` class API, if it remains exported
    - implementation should delegate static helpers and merge semantics to `@tailwindest/core`
- `packages/tailwindest/src/tools/primitive.ts`
    - public `PrimitiveStyler` class API
    - implementation delegates to core primitive model helpers
- `packages/tailwindest/src/tools/toggle.ts`
    - public `ToggleStyler` class API
    - implementation delegates to core toggle model helpers
- `packages/tailwindest/src/tools/rotary.ts`
    - public `RotaryStyler` class API
    - implementation delegates to core rotary model helpers
- `packages/tailwindest/src/tools/variants.ts`
    - public `VariantsStyler` class API
    - implementation delegates to core variants model helpers
- `packages/tailwindest/src/index.ts`
    - existing public exports must remain source-compatible

### Keep In `@tailwindest/compiler`

The compiler package owns compile-time safety and integration.

Do not move:

- analyzer/provenance logic under `packages/tailwindest-compiler/src/analyzer`
- `CompileValue`, `ApiCompileInput`, replacement plans, generated expressions
- diagnostics and fallback behavior
- `MergerPolicy`, `EvaluationResult` exact/fallback diagnostics, unless a later design creates a separate compiler-safety package
- `variant_optimizer.ts`; it uses semantic helpers but still owns compile-time table sizing and fallback decisions
- Vite context, HMR, Tailwind manifest, source injection, import cleanup, source maps
- debug manifest schema

## Semantic Invariants

Extraction is correct only if these results remain identical:

- Core `join(values, default runtime merger)` must equal
  `createTools().join(...values)` for supported static class values.
- Core `def(classList, styles, default runtime merger)` must equal
  `createTools().def(classList, ...styles)`.
- Core `mergeRecord(styles)` must equal
  `createTools().mergeRecord(...styles)`.
- Core `mergeProps(styles, default runtime merger)` must equal
  `createTools().mergeProps(...styles)`.
- `primitiveClass(createPrimitiveModel(style), extra)` must equal
  `tw.style(style).class(...extra)`.
- `primitiveStyle(createPrimitiveModel(style), extra)` must equal
  `tw.style(style).style(...extra)`.
- `primitiveClass(composePrimitive(model, styles))` must equal
  `tw.style(style).compose(...styles).class()`.
- `toggleClassFor(createToggleModel(config), condition, extra)` must equal
  `tw.toggle(config).class(condition, ...extra)`.
- `toggleStyleFor(createToggleModel(config), condition, extra)` must equal
  `tw.toggle(config).style(condition, ...extra)`.
- `rotaryClassFor(createRotaryModel(config), key, extra)` must equal
  `tw.rotary(config).class(key, ...extra)`.
- `rotaryStyleFor(createRotaryModel(config), key, extra)` must equal
  `tw.rotary(config).style(key, ...extra)`.
- `variantsClassFor(createVariantsModel(config), props, extra)` must equal
  `tw.variants(config).class(props, ...extra)`.
- `variantsStyleFor(createVariantsModel(config), props, extra)` must equal
  `tw.variants(config).style(props, ...extra)`.
- Candidate extraction helpers must be derived from the same `getClassName` and
  `toClass` output that runtime uses.

## Known Risk Points

- `tailwindest` currently uses `clsx` for `join`; compiler has a local `toClass` implementation. Because runtime is authoritative, core must preserve the `clsx` behavior used by `tailwindest`, and compiler must adapt to that behavior.
- `style_normalizer.ts` must not duplicate compiler-oriented variant prefix
  generation into runtime core. Runtime structural flattening and compiler
  compiled-style normalization are separate responsibilities.
- Runtime styler classes are public exports. Moving class implementations wholesale would be a larger API risk; delegate to core first, then consider class relocation only if public API tests remain stable.
- Compiler `MergerPolicy` is not the same as runtime `Merger`. Runtime merger executes user code; compiler merger is a safety policy. Keep these separated.
- Compiler fallback diagnostics must not enter core. Core computes semantic output; compiler decides whether output may replace source.

## Task 1: Create `@tailwindest/core` Package

**Files:**

- Create: `packages/tailwindest-core/package.json`
- Create: `packages/tailwindest-core/tsup.config.ts`
- Create: `packages/tailwindest-core/src/index.ts`
- Create: `packages/tailwindest-core/src/class_list.ts`
- Create: `packages/tailwindest-core/src/style_normalizer.ts`
- Create: `packages/tailwindest-core/src/style_engine.ts`
- Create: `packages/tailwindest-core/src/styler_model.ts`
- Create: `packages/tailwindest-core/src/evaluation_engine.ts`
- Create: `packages/tailwindest-core/src/__tests__/runtime_parity.test.ts`

**Step 1: Write failing runtime-authority parity tests**

Write tests that compare new core helpers against the current `tailwindest`
runtime implementation. Do not compare core primarily against compiler helpers.

Move or copy useful assertions from
`packages/tailwindest-compiler/src/core/__tests__/evaluator.test.ts`, but make
the expected side `createTools()`, `Styler`, and runtime styler classes from
`packages/tailwindest/src/tools`.

Add styler-level parity cases for:

- primitive class/style/compose
- toggle class/style/compose
- rotary class/style/compose
- variants class/style/compose
- `join` with strings, numbers, bigint, booleans, nullish values, arrays, and dictionary values
- custom merger tokenization

Run:

```bash
pnpm --filter @tailwindest/core test
```

Expected: fails because the package does not exist yet.

**Step 2: Add the package and minimal exports**

Implement package metadata:

```json
{
    "name": "@tailwindest/core",
    "version": "0.0.1",
    "type": "module",
    "main": "dist/index.mjs",
    "module": "dist/index.mjs",
    "types": "dist/index.d.ts",
    "files": ["dist"],
    "sideEffects": false,
    "scripts": {
        "build": "tsup src/index.ts --format=esm --dts",
        "test": "vitest run"
    },
    "dependencies": {
        "clsx": "^2.1.1"
    },
    "publishConfig": {
        "access": "public"
    }
}
```

**Step 3: Extract runtime pure functions**

Move implementation from `packages/tailwindest/src/tools` without semantic
changes:

- `flattenStyleRecord`
- `deepMerge`
- `getClassName`
- `toClass`
- `toDef`
- styler model helpers derived from runtime class behavior
- evaluation engine helpers derived from runtime `createTools()` behavior

Run:

```bash
pnpm --filter @tailwindest/core test
```

Expected: core parity tests pass.

## Task 2: Rewire `tailwindest` Runtime To Core

**Files:**

- Modify: `packages/tailwindest/package.json`
- Modify: `packages/tailwindest/src/tools/styler.ts`
- Modify: `packages/tailwindest/src/tools/to_class.ts`
- Modify: `packages/tailwindest/src/tools/to_def.ts`
- Modify: `packages/tailwindest/src/tools/primitive.ts`
- Modify: `packages/tailwindest/src/tools/toggle.ts`
- Modify: `packages/tailwindest/src/tools/rotary.ts`
- Modify: `packages/tailwindest/src/tools/variants.ts`
- Modify: `packages/tailwindest/src/tools/create_tools.ts` only if imports need cleanup

**Step 1: Add dependency**

Add:

```json
"@tailwindest/core": "workspace:*"
```

**Step 2: Delegate static helpers without changing runtime results**

Change `Styler.flattenRecord`, `Styler.deepMerge`, and `Styler.getClassName` to call `@tailwindest/core`.

**Step 3: Delegate class-list helpers**

Change `toClass` and `toDef` to re-export or wrap core helpers.

**Step 4: Delegate styler behavior while preserving public class semantics**

Keep public classes and generic signatures. Replace duplicated internals with core model calls.

Example target shape:

```ts
import {
    createPrimitiveModel,
    primitiveClass,
    primitiveStyle,
    composePrimitive,
} from "@tailwindest/core"

export class PrimitiveStyler<
    StyleType,
    StyleLiteral extends string = string,
> extends Styler<never, StyleType, StyleLiteral> {
    private _model: PrimitiveStyleModel<StyleType>

    public constructor(style: StyleType) {
        super()
        this._model = createPrimitiveModel(style)
    }

    public class(
        ...extraClassList: AdditionalClassTokens<StyleLiteral>
    ): string {
        const className = primitiveClass(this._model, [])
        return extraClassList.length === 0
            ? className
            : this.merge(className as StyleLiteral, ...extraClassList)
    }
}
```

Run:

```bash
pnpm --filter tailwindest test
pnpm --filter tailwindest build
```

Expected: runtime tests and build pass with no public API changes.

If any runtime test output changes, stop and treat that as a failed extraction.
Do not update expectations unless the user explicitly approves a runtime
semantic change.

## Task 3: Rewire Compiler To Core

**Files:**

- Modify: `packages/tailwindest-compiler/package.json`
- Modify: `packages/tailwindest-compiler/src/core/evaluator.ts`
- Modify: `packages/tailwindest-compiler/src/core/styler_model.ts`
- Modify: `packages/tailwindest-compiler/src/core/variant_optimizer.ts`
- Modify: `packages/tailwindest-compiler/src/core/api_compile.ts`
- Modify: `packages/tailwindest-compiler/src/vite/context.ts`
- Delete or reduce: `packages/tailwindest-compiler/src/core/style_normalizer.ts`

**Step 1: Add dependency**

Add:

```json
"@tailwindest/core": "workspace:*"
```

**Step 2: Replace evaluator implementation with runtime-authority core calls**

Make `src/core/evaluator.ts` a compatibility facade that imports core semantic helpers and wraps compiler-only `MergerPolicy` diagnostics.

Keep compiler-owned behavior in place:

- `MergerPolicy`
- `EvaluationResult`
- `exact`
- `fallback`
- diagnostics

**Step 3: Replace styler model implementation with runtime-authority core calls**

Either re-export core styler model helpers or import them directly where used.

**Step 4: Keep variant optimizer compiler-owned**

Only replace semantic calls:

- `deepMerge`
- `getClassName`
- candidate tokenization

Do not move table-size checks or fallback diagnostics.

Run:

```bash
pnpm --filter @tailwindest/compiler test
pnpm --filter @tailwindest/compiler build
```

Expected: compiler tests and build pass.

If compiler expectations differ from `tailwindest` runtime output, update the
compiler expectation or compiler adapter. Runtime output remains authoritative.

## Task 4: Remove Duplicates and Add Drift Guards

**Files:**

- Delete or shrink duplicate runtime/compiler files after imports are rewired.
- Create: `packages/tailwindest-core/src/__tests__/public_api_matrix.test.ts`
- Modify: `packages/tailwindest-compiler/src/core/__tests__/evaluator.test.ts`

**Step 1: Add core semantic matrix**

The matrix must compare:

- core helpers
- `tailwindest` `createTools()` runtime
- compiler low-level outputs where exact replacement is expected

**Step 2: Add negative drift assertions**

Assert that no compiler-local duplicate implementation remains for:

- `flattenStyleRecord`
- `deepMerge`
- `toClass`
- styler model class/style semantics

Use source-level assertions sparingly; prefer import graph and behavior tests.

Run:

```bash
pnpm --filter @tailwindest/core test
pnpm --filter tailwindest test
pnpm --filter @tailwindest/compiler test
```

Expected: all pass.

## Task 5: Release Verification

Run:

```bash
pnpm --filter @tailwindest/core build
pnpm --filter tailwindest build
pnpm --filter @tailwindest/compiler build
pnpm --filter @tailwindest/compiler test
pnpm --filter tailwindest test
pnpm --filter @tailwindest/compiler pack:dry
```

Expected:

- all commands pass;
- `tailwindest` runtime results are unchanged;
- compiler exact outputs match runtime;
- unsupported compiler cases still preserve runtime source;
- no duplicated semantic engine remains.

## Non-Goals

- Do not change public `createTools()` type behavior.
- Do not change compiler fallback policy.
- Do not move analyzer, codegen, Vite, Tailwind manifest, or debug manifest code.
- Do not introduce a new merger abstraction that executes runtime mergers in the compiler.
- Do not promise zero-runtime output for runtime-dependent calls.
