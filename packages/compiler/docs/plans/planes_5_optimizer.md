# Tailwindest API Surface and Variant Optimizer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Compile every possible `createTools()` public API call into static strings, object literals, ternaries, or lookup tables while preserving runtime semantics.

**Architecture:** API compilation sits between detection and substitution. It consumes `TailwindestCallSite` plus static values and emits `ReplacementPlan`s. Variant optimization uses conflict graphs to avoid cartesian explosion while still registering all Tailwind candidates.

**Tech Stack:** TypeScript AST spans, evaluator from Phase 1, static resolver from Phase 2, Vitest, property-style exhaustive combination tests.

---

## Files

- Create: `packages/compiler/src/core/api_compile.ts`
- Create: `packages/compiler/src/core/styler_model.ts`
- Create: `packages/compiler/src/core/variant_optimizer.ts`
- Create: `packages/compiler/src/core/codegen.ts`
- Test: `packages/compiler/src/core/__tests__/api_compile.test.ts`
- Test: `packages/compiler/src/core/__tests__/variant_optimizer.test.ts`
- Test: `packages/compiler/src/core/__tests__/zero_runtime_codegen.test.ts`

## Compile Surface

Must cover:

- `tw.style(obj).class(...extra)`
- `tw.style(obj).style(...extra)`
- `tw.style(obj).compose(...styles)`
- `tw.toggle(config).class(condition, ...extra)`
- `tw.toggle(config).style(condition, extraStyle?)`
- `tw.toggle(config).compose(...styles)`
- `tw.rotary(config).class(key, ...extra)`
- `tw.rotary(config).style(key, ...extraStyles)`
- `tw.rotary(config).compose(...styles)`
- `tw.variants(config).class(props, ...extra)`
- `tw.variants(config).style(props, ...extraStyles)`
- `tw.variants(config).compose(...styles)`
- `tw.join(...classList)`
- `tw.def(classList, ...styleList)`
- `tw.mergeProps(...styles)`
- `tw.mergeRecord(...styles)`

## Implementation Steps

### Step 1: Write full API golden tests

For every API above, add:

- static input compiles exactly.
- dynamic input compiles to ternary/lookup only when exact.
- unsupported input emits fallback diagnostic.
- generated candidate list includes every possible class.

Run:

```bash
pnpm --filter @tailwindest/compiler test -- src/core/__tests__/api_compile.test.ts
```

### Step 2: Implement styler model folding

Rules:

- Represent `style`, `toggle`, `rotary`, and `variants` as immutable compile-time models.
- `compose` mutates only the compile-time model, never runtime source.
- `.style()` returns object literal or lookup object, not class string.
- `.class()` returns string literal, ternary, or lookup expression.
- Extra class/style arguments are applied with evaluator semantics.

### Step 3: Implement dynamic codegen

Allowed generated forms:

- string literal.
- object literal.
- conditional expression for boolean toggle.
- readonly lookup object for rotary and variants.
- small helper expression using array join only when it replaces runtime styler logic exactly.

Forbidden generated forms:

- calling `createTools()` or styler classes.
- embedding runtime evaluator.
- executing user functions.
- sorting classes to look nicer.

### Step 4: Implement variant conflict graph

Algorithm:

1. Compute style path write set for every axis value.
2. Build conflict edges between axes that write overlapping paths.
3. Emit additive maps for independent axes.
4. Emit component lookup tables for conflicting axis groups.
5. If a component table exceeds `variantTableLimit`, loose mode fallback or strict mode error.
6. Always register every possible class candidate in the manifest.

### Step 5: Add exhaustive combination tests

Required variant tests:

- independent axes produce additive maps.
- conflicting axes produce component table.
- three or more axes with mixed independent/conflicting groups.
- boolean-like and numeric-like variant keys.
- missing props return runtime-equivalent base behavior.
- extra class names merge after variant class.
- threshold overflow strict error.
- threshold overflow loose fallback with manifest candidates.

## Completion Criteria

- API golden tests cover every public surface in `create_tools.ts`.
- Runtime parity tests compare all generated dynamic paths against runtime output.
- Variant optimizer proves no cartesian table is emitted for independent axes.
- Zero-runtime codegen test proves no styler runtime import remains for fully compiled files.
